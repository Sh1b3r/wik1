import bpy
import math

def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def make_mat(name, color, roughness=0.2, metalness=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metalness
    return mat

def create_classic_space_logo():
    clean_scene()

    # Materials
    mat_yellow_planet = make_mat("LogoYellowPlanet", (1.0, 0.82, 0.02, 1.0), roughness=0.25)
    mat_white_rim = make_mat("LogoWhiteOutline", (0.95, 0.95, 0.95, 1.0), roughness=0.3)
    mat_red_ship = make_mat("LogoRedShip", (0.95, 0.05, 0.05, 1.0), roughness=0.2)

    # 1. Main Yellow Planet Sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=2.0, location=(0, 0, 0), segments=64, ring_count=32)
    planet = bpy.context.active_object
    planet.name = "Logo_Yellow_Planet"
    planet.data.materials.append(mat_yellow_planet)

    # Subtle white outline shell around planet
    bpy.ops.mesh.primitive_uv_sphere_add(radius=2.06, location=(0, 0, 0), segments=64, ring_count=32)
    planet_rim = bpy.context.active_object
    planet_rim.name = "Logo_Planet_White_Rim"
    planet_rim.data.materials.append(mat_white_rim)

    # Group for orbital ring and rocket
    # Tilt the orbit plane ~ 22 degrees
    TILT_ANGLE = math.radians(22)

    # 2. Orbital Trail Ring curving around the planet
    # We construct a smooth curved curve / bevel ribbon for the red orbital path
    curve_data = bpy.data.curves.new('OrbitTrailPath', type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 0.12
    curve_data.bevel_resolution = 6

    polyline = curve_data.splines.new('BEZIER')
    # Generate points curving from back around to front
    r_orbit = 2.6
    angles = [math.radians(deg) for deg in range(160, 360 + 35, 20)]
    polyline.bezier_points.add(len(angles) - 1)

    for i, a in enumerate(angles):
        p = polyline.bezier_points[i]
        x = math.cos(a) * (r_orbit + (i / len(angles)) * 0.8)
        y = math.sin(a) * (r_orbit * 0.85)
        z = y * math.tan(TILT_ANGLE)
        p.co = (x, y, z)
        p.handle_left_type = 'AUTO'
        p.handle_right_type = 'AUTO'

    trail_obj = bpy.data.objects.new('Logo_Orbit_Trail', curve_data)
    bpy.context.collection.objects.link(trail_obj)
    trail_obj.data.materials.append(mat_red_ship)

    # 3. Exhaust dashed segments near the rocket
    # In the logo there are 2 dashed rect lines right behind the rocket
    dash_positions = [
        (3.0, 1.2, 0.48),
        (3.4, 1.36, 0.55),
    ]
    for idx, (dx, dy, dz) in enumerate(dash_positions):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(dx, dy, dz))
        dash = bpy.context.active_object
        dash.name = f"Trail_Dash_{idx}"
        dash.scale = (0.22, 0.08, 0.18)
        dash.rotation_euler = (0, 0, math.radians(24))
        dash.data.materials.append(mat_red_ship)

    # 4. Volumetric Stylized Red Rocket Ship at the apex
    # Body
    rocket_x, rocket_y, rocket_z = 4.2, 1.7, 0.68
    bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=1.2, location=(rocket_x, rocket_y, rocket_z))
    rocket_body = bpy.context.active_object
    rocket_body.name = "Logo_Rocket_Body"
    rocket_body.rotation_euler = (0, math.radians(66), math.radians(22))
    rocket_body.data.materials.append(mat_red_ship)

    # Rounded nose cap
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.35, location=(rocket_x + 0.55, rocket_y + 0.22, rocket_z + 0.09))
    nose = bpy.context.active_object
    nose.name = "Logo_Rocket_Nose"
    nose.scale = (1.2, 1.0, 1.0)
    nose.data.materials.append(mat_red_ship)

    # Wings (smooth volumetric rounded delta wings)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(rocket_x - 0.25, rocket_y - 0.1, rocket_z - 0.04))
    wings = bpy.context.active_object
    wings.name = "Logo_Rocket_Wings"
    wings.scale = (0.45, 1.4, 0.18)
    wings.rotation_euler = (0, math.radians(66), math.radians(22))
    wings.data.materials.append(mat_red_ship)

    # Wingtip spheres for the authentic puffy retro silhouette
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_uv_sphere_add(
            radius=0.2,
            location=(rocket_x - 0.35 + side * 0.1, rocket_y - 0.15 + side * 0.65, rocket_z - 0.05)
        )
        tip = bpy.context.active_object
        tip.name = f"Wing_Tip_{side}"
        tip.data.materials.append(mat_red_ship)

    # Smooth shading across meshes
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            for poly in obj.data.polygons:
                poly.use_smooth = True

    print(">>> Classic Space Logo 3D model generated successfully! <<<")

if __name__ == "__main__":
    create_classic_space_logo()

    # Save Blender file
    blend_path = "c:\\Users\\Vanya\\Documents\\WEB\\wiki\\classic_space_logo.blend"
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Saved .blend to {blend_path}")

    # Export to GLB
    glb_path = "c:\\Users\\Vanya\\Documents\\WEB\\wiki\\classic_space_logo.glb"
    try:
        bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB')
        print(f"Exported to {glb_path}")
    except Exception as e:
        print(f"GLTF export info: {e}")
