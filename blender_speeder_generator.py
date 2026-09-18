import bpy
import math

def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def make_mat(name, color, roughness=0.15, transmission=0.0, metallic=0.0, emission=None):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        # Base color (RGBA)
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        if transmission > 0:
            if 'Transmission Weight' in bsdf.inputs:
                bsdf.inputs['Transmission Weight'].default_value = transmission
            elif 'Transmission' in bsdf.inputs:
                bsdf.inputs['Transmission'].default_value = transmission
            mat.blend_method = 'BLEND'
        if emission:
            if 'Emission Color' in bsdf.inputs:
                bsdf.inputs['Emission Color'].default_value = emission
                bsdf.inputs['Emission Strength'].default_value = 5.0
            elif 'Emission' in bsdf.inputs:
                bsdf.inputs['Emission'].default_value = emission
    return mat

def create_speeder():
    clean_scene()

    # Materials
    mat_grey = make_mat("LegoGrey", (0.75, 0.77, 0.8, 1.0), roughness=0.2)
    mat_blue = make_mat("LegoBlue", (0.02, 0.35, 0.82, 1.0), roughness=0.2)
    mat_yellow_glass = make_mat("LegoYellowGlass", (1.0, 0.85, 0.05, 0.45), roughness=0.05, transmission=0.85)
    mat_orange_light = make_mat("LegoTransOrange", (1.0, 0.45, 0.0, 0.6), roughness=0.1, transmission=0.6, emission=(1.0, 0.45, 0.0, 1.0))
    mat_headlight = make_mat("LegoTransClear", (0.9, 0.95, 1.0, 0.5), roughness=0.1, transmission=0.7, emission=(0.9, 0.95, 1.0, 1.0))
    mat_black = make_mat("LegoBlack", (0.08, 0.08, 0.09, 1.0), roughness=0.3)
    mat_white = make_mat("LegoWhite", (0.95, 0.95, 0.95, 1.0), roughness=0.2)
    mat_grille = make_mat("LegoGrille", (0.2, 0.22, 0.25, 1.0), roughness=0.4, metallic=0.7)

    # 1. Main Base Chassis (Flat aerodynamic body)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.4))
    chassis = bpy.context.active_object
    chassis.name = "Speeder_Chassis"
    chassis.scale = (3.2, 7.6, 0.5)
    chassis.data.materials.append(mat_grey)

    # 2. Side Curved Mudguards / Aerodynamic Rails
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=7.4, location=(side * 1.6, 0, 0.4))
        cyl = bpy.context.active_object
        cyl.name = f"Side_Rail_{side}"
        cyl.rotation_euler = (math.radians(90), 0, 0)
        cyl.data.materials.append(mat_grey)

    # 3. Front Nose Curve / Round intake bumper
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=3.2, location=(0, 3.8, 0.4))
    front_curve = bpy.context.active_object
    front_curve.name = "Front_Bumper_Curve"
    front_curve.rotation_euler = (0, math.radians(90), 0)
    front_curve.data.materials.append(mat_grey)

    # Rear Bumper Curve
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=3.2, location=(0, -3.8, 0.4))
    rear_curve = bpy.context.active_object
    rear_curve.name = "Rear_Bumper_Curve"
    rear_curve.rotation_euler = (0, math.radians(90), 0)
    rear_curve.data.materials.append(mat_grey)

    # 4. Center Front Turbine / Jet Grille
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=0.35, location=(0, 3.85, 0.4))
    turbine = bpy.context.active_object
    turbine.name = "Front_Turbine"
    turbine.rotation_euler = (math.radians(90), 0, 0)
    turbine.data.materials.append(mat_grille)

    # Turbine rim
    bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.08, location=(0, 3.98, 0.4))
    torus = bpy.context.active_object
    torus.rotation_euler = (math.radians(90), 0, 0)
    torus.data.materials.append(mat_grey)

    # 5. Dual Front Headlights (left and right of turbine)
    for side in [-1, 1]:
        # Inner clear lights
        bpy.ops.mesh.primitive_cylinder_add(radius=0.24, depth=0.25, location=(side * 0.8, 3.85, 0.4))
        light1 = bpy.context.active_object
        light1.rotation_euler = (math.radians(90), 0, 0)
        light1.data.materials.append(mat_headlight)

        bpy.ops.mesh.primitive_cylinder_add(radius=0.24, depth=0.25, location=(side * 1.25, 3.85, 0.4))
        light2 = bpy.context.active_object
        light2.rotation_euler = (math.radians(90), 0, 0)
        light2.data.materials.append(mat_headlight)

        # Amber outer marker light
        bpy.ops.mesh.primitive_cylinder_add(radius=0.2, depth=0.22, location=(side * 1.68, 3.65, 0.4))
        amber = bpy.context.active_object
        amber.rotation_euler = (0, math.radians(90), 0)
        amber.data.materials.append(mat_orange_light)

        # Rear amber marker light
        bpy.ops.mesh.primitive_cylinder_add(radius=0.2, depth=0.22, location=(side * 1.68, -3.65, 0.4))
        rear_amber = bpy.context.active_object
        rear_amber.rotation_euler = (0, math.radians(90), 0)
        rear_amber.data.materials.append(mat_orange_light)

    # 6. Side Repulsor / Thruster Greebles
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.4, location=(side * 1.75, -0.6, 0.35))
        greeble = bpy.context.active_object
        greeble.rotation_euler = (0, math.radians(90), 0)
        greeble.data.materials.append(mat_grey)

        # Accent stripes (Black and Yellow hazard pattern on sides)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(side * 1.62, 0.3, 0.4))
        stripe1 = bpy.context.active_object
        stripe1.scale = (0.05, 0.3, 0.42)
        stripe1.data.materials.append(mat_black)

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(side * 1.62, 0.65, 0.4))
        stripe2 = bpy.context.active_object
        stripe2.scale = (0.05, 0.3, 0.42)
        stripe2.data.materials.append(mat_yellow_glass)

    # 7. Hood Racing Stripes (Blue & Yellow tiles)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-0.3, 2.3, 0.67))
    hood_stripe1 = bpy.context.active_object
    hood_stripe1.scale = (0.35, 0.3, 0.05)
    hood_stripe1.data.materials.append(mat_blue)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.3, 2.3, 0.67))
    hood_stripe2 = bpy.context.active_object
    hood_stripe2.scale = (0.35, 0.3, 0.05)
    hood_stripe2.data.materials.append(mat_black)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 2.6, 0.67))
    hood_tile = bpy.context.active_object
    hood_tile.scale = (0.8, 0.25, 0.05)
    hood_tile.data.materials.append(mat_blue)

    # 8. Trans-Yellow Wrap-around Canopy (Cockpit Glass)
    bpy.ops.mesh.primitive_cylinder_add(radius=1.35, depth=0.45, location=(0, 0.75, 0.85))
    canopy = bpy.context.active_object
    canopy.name = "Canopy_Glass"
    canopy.scale = (1.05, 1.25, 1.0)
    canopy.data.materials.append(mat_yellow_glass)

    # Cockpit Interior Seat / Dashboard hint
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.6, 0.8))
    seat = bpy.context.active_object
    seat.scale = (1.1, 1.2, 0.35)
    seat.data.materials.append(mat_black)

    # 9. Aerodynamic Blue Roof
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.45, 1.2))
    roof = bpy.context.active_object
    roof.name = "Speeder_Roof"
    roof.scale = (2.2, 2.4, 0.22)
    roof.data.materials.append(mat_blue)

    # Roof front visor slope
    bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=2.2, location=(0, 1.65, 1.15))
    roof_front = bpy.context.active_object
    roof_front.rotation_euler = (0, math.radians(90), 0)
    roof_front.data.materials.append(mat_blue)

    # Sloped back wedge / rear fin integration
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.2, 0.95))
    rear_slope = bpy.context.active_object
    rear_slope.rotation_euler = (math.radians(-18), 0, 0)
    rear_slope.scale = (2.1, 1.6, 0.2)
    rear_slope.data.materials.append(mat_blue)

    # 10. Classic Space Rear Wing / Spoiler
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -2.4, 0.85))
    wing = bpy.context.active_object
    wing.scale = (1.8, 0.5, 0.1)
    wing.data.materials.append(mat_blue)

    # Rear spoiler fins
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(side * 0.9, -2.5, 1.0))
        fin = bpy.context.active_object
        fin.scale = (0.1, 0.4, 0.25)
        fin.rotation_euler = (math.radians(-15), 0, side * math.radians(-10))
        fin.data.materials.append(mat_blue)

    # 11. Dual Classic Antennas on Roof
    for side in [-1, 1]:
        # Ball base
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(side * 0.28, 0.1, 1.35))
        antenna_base = bpy.context.active_object
        antenna_base.data.materials.append(mat_white)

        # Antenna mast tilted backwards
        bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.85, location=(side * 0.35, -0.22, 1.7))
        antenna = bpy.context.active_object
        antenna.rotation_euler = (math.radians(-32), 0, side * math.radians(8))
        antenna.data.materials.append(mat_white)

        # Small antenna tip bead
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, location=(side * 0.41, -0.44, 2.05))
        tip = bpy.context.active_object
        tip.data.materials.append(mat_white)

    # 12. LEGO Studs on Hood & Rear for authenticity
    for x in [-0.5, 0.5]:
        for y in [1.8, 2.8, 3.2]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=0.08, location=(x, y, 0.68))
            stud = bpy.context.active_object
            stud.data.materials.append(mat_grey)

    # Select all and smooth
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            for poly in obj.data.polygons:
                poly.use_smooth = True

    print(">>> Lego Speeder generation completed successfully! <<<")

if __name__ == "__main__":
    create_speeder()
    
    # Export options:
    # Save as .blend
    blend_path = "speeder_classic_space.blend"
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Saved .blend to {blend_path}")

    # Export to .glb for web
    glb_path = "speeder.glb"
    try:
        bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB')
        print(f"Exported web model to {glb_path}")
    except Exception as e:
        print(f"GLTF export info: {e}")
