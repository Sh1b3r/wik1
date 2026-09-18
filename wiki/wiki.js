const day = document.querySelectorAll(".day, #day");
const year = document.querySelectorAll(".year, #year");
const month = document.querySelectorAll(".month, #month");
const article = document.querySelectorAll(".article, #article");
const minute = document.querySelectorAll(".minute, #minute");
const hour = document.querySelectorAll(".hour, #hour");
const parsoid = document.querySelectorAll(".parsoid, #parsoid");
const randoms = ["wiki.html", "Voynich.html", "Tardigrada.html", "Movile.html", "Tenere.html", "Antikythera.html", "Wow.html", "Bloop.html", "Bouvet.html", "Kukulkan.html", "Seborga.html", "Rockall.html", "Seborga.html", "Sponge.html", "Tavolara.html", "ExplodingHead.html", "DunningKruger.html", "TerenceTate.html", "Discordianism.html", "BallLightning.html", "ClassicSpace.html",];
const random = document.querySelectorAll("#random");

day.forEach(d => d.textContent = Math.floor(Math.random() * 365) + 1);
year.forEach(y => y.textContent = Math.floor(Math.random() * 3000) + 1);
article.forEach(a => a.textContent = Math.floor(Math.random() * 1000000000) + 1);
minute.forEach(m => m.textContent = Math.floor(Math.random() * 99) + 1);
hour.forEach(h => h.textContent = Math.floor(Math.random() * 49) + 1);

random.forEach(r => r.href = randoms[Math.floor(Math.random() * randoms.length)]);

const months = [
    "січня", "лютого", "березня", "квітня", "травня", "червня",
    "липня", "серпня", "вересня", "жовтня", "листопада", "грудня",
    "0000", "іьхічф", "цщьщзш", "бштушу", "щч", "في مارس",
    "янтівк", "Jbmfxhyq", "December"
];

const parsoids = [
    "Виктор", "Іван", "Петро", "Василь", "Олександр", "Михайло",
    "PArsoid", "Parsoid", "Parsoid", "Google", "Youtube", "Facebook",
    "Instagram", "Twitter", "Tik Tok", "Microsoft", "Apple", "Parson",
    "Temu", "АЛіекспресс", "Ilon Mask", "Steve Job", "Mark Cucketburg",
    "Stephen King"
];

const weekdayArr = [
    "понеділок", "вівторок", "середа", "четвер", "п'ятниця",
    "субота", "неділя", "Ісус Христос", "Будда", "Gollum",
    "Barack Obama", "Billie Eilish", "phjpir", "котротвів",
    "Леонід Каневський"
];

const weekday = document.querySelectorAll(".weekday, #weekday");

month.forEach(m =>
    m.textContent = months[Math.floor(Math.random() * months.length)]
);

weekday.forEach(w =>
    w.textContent = weekdayArr[Math.floor(Math.random() * weekdayArr.length)]
);

parsoid.forEach(p =>
    p.textContent = parsoids[Math.floor(Math.random() * parsoids.length)]
);


// =======================================================
// SEARCH LOGIC
// =======================================================

const allProducts = [
    {
        id: "Тихоходи",
        href: "Tardigrada.html",
        name: "Тихоходи (Tardigrada)",
        image: "images/Тихоходи.webp",
        description: "Тихохо́ди (лат. Tardigrada) — тип мікроскопічних безхребетних <a href=''>тварин</a>, близьких до членистоногих. Тихоходи відомі своєю надзвичайною <a href=''>виживаністю</a>: вони здатні переносити заморожування до -272 °C, тривале кип'ятіння, нагрівання до +150 °C, високі дози <a href=''>іонізуючої радіації</a> (до 570 000 рентген), вакуум <a href=''>відкритого космосу</a> та тиск до 6000 атмосфер (що у 6 разів перевищує тиск на дні <a href=''>Маріанського жолоба</a>). У стані <a href=''>ангідробіозу</a> (зневоднення) вони сповільнюють свій метаболізм до 0,01% від норми та згортаються у компактний «бочонок», здатний витримувати десятиліття несприятливих умов без їжі та води. Науковці також виявили, що унікальний білок Dsup захищає їхню <a href=''>ДНК</a> від руйнування радіацією та окиснювальним стресом."
    },

    {
        id: "Рукопис Войнича",
        href: "Voynich.html",
        name: "VGhlcmUgaXMgbm8gcGFnZSBoZXJl [ENCRYPTED:           ]",
        image: "images/Войнич.jpg",
        description: "01010010 01110101 01101011 01101001 01110010 01111001 01110011 00100000 01010110 01101111 01111001 01101001 01100011 01101000 00101110 <a href=''>01000011 01101111 01100100 01100101 01111001</a>. Vm95bmlja CBNYW51c2NyaXB0IGlzIGFuIGlsbHVzdHJhdGVkIGNvZGV4IGhhbmR3cml0dGVuIGluIGFuIHVua25vd24gd3JpdGluZyBzeXN0ZW0uIDxhIGhyZWY9Jyc+Q3J5cHRvZ3JhcGh5PC9hPiBoYXMgZmFpbGVkIHRvIGRlY29kZSBpdHMgY29udGVudHMgZm9yIGNlbnR1cmllcy4gV2l0aCAyNDAgcGFnZXMgb2YgdW5rbm93biBib3RhbmljYWwsIGFzdHJvbm9taWNhbCwgYW5kIHBoYXJtYWNldXRpY2FsIGlsbHVzdHJhdGlvbnMsIGl0IHJlbWFpbnMgdGhlIHdvcmxkJ3MgbW9zdCBteXN0ZXJpb3VzIDxhIGhyZWY9Jyc+bWFudXNjcmlwdDwvYT4uIDAxMDExMDAxIDAxMTAxMTExIDAxMTAxNTAxIDAxMTAwMTAxIDAxMTAwMTAw"
    },

    {
        id: "Печера Мовіле",
        href: "Movile.html",
        name: "Papa Echo Charlie Echo Romeo Alpha - Movile",
        image: "images/Мовіле.jpg",
        description: "P-A-P-A E-C-H-O C-H-A-R-L-I-E R-O-M-E-O A-L-P-H-A. M-O-V-I-L-E I-S A U-N-I-Q-U-E C-A-V-E I-N R-O-M-A-N-I-A <a href=''>I-S-O-L-A-T-E-D</a> F-O-R 5.5 M-I-L-L-I-O-N Y-E-A-R-S. T-H-E A-T-M-O-S-P-H-E-R-E I-S R-I-C-H I-N H-Y-D-R-O-G-E-N S-U-L-F-I-D-E A-N-D M-E-T-H-A-N-E <a href=''>E-C-O-S-Y-S-T-E-M</a>. F-I-F-T-Y O-N-E S-P-E-C-I-E-S O-F I-N-V-E-R-T-E-B-R-A-T-E-S <a href=''>E-N-D-E-M-I-C-S</a> L-I-V-E H-E-R-E."
    },

    {
        id: "Дерево Тенере",
        href: "Tenere.html",
        name: "ᚠᚢᚦᚨᚱᚲ ᛖᚱᚱᚩᚱ: Arbre du Ténéré",
        image: "images/Тенере.jpg",
        description: "ᛞᛖᛖᚠᛟ ᛏᛖᚾᛖᚱᛖ — ᛋᚨᛗᛟᛏᚾᛖ ᛞᛖᚱᛖᚠᛟ ᚠ ᛈᚢᛋᛏᛖᛚᛁ <a href=''>ᛋᚨᚺᚨᚱᚨ</a>. 0x41 0x72 0x62 0x72 0x65 0x20 0x64 0x75 0x20 0x54 0x65 0x6E 0x65 0x72 0x65 <a href=''>0x49 0x73 0x6F 0x6C 0x61 0x74 0x65 0x64</a> 0x54 0x72 0x65 0x65 0x2E ᛞᛖᛖᛈ ᚱᛟᛟᛏᛋ ᛋᛏᛏᚱᛖᛏᚱᚺᛖᛞ 33 ᛗᛖᛏᛖᚱᛋ ᛞᛟᚠᚾ ᛏᛟ ᚠᚨᛏᛖᚱ. ᚴᚾᚴᚴᛖᛞ ᛞᛟᚠᚾ 0x4D 0x65 0x74 0x61 0x6C <a href=''>0x4D 0x6F 0x6E 0x75 0x6D 0x65 0x6E 0x74</a>."
    },

    {
        id: "Острів Рокелл",
        href: "Rockall.html",
        name: "Острів Рокелл",
        image: "images/Рокелл.jpg",
        description: "Ро́келл — незалюблена ізольована гранітна <a href=''>скеля</a> у північній частині Атлантичного океану заввишки 17.15 метрів та площею близько 784 м². Попри мікроскопічні розміри та відсутність джерел прісної води, через цю скелю роками тривають геополітичні суперечки між <a href=''>Великою Британією</a>, Ірландією, <a href=''>Данією</a> (Фарерські острови) та Ісландією. Головна причина боротьби — права на ексклюзивну економічну зону навколо скелі та розвідку континентального шельфу із багатими покладами <a href=''>нафти</a>, природного газу та рибними ресурсами. У 1985 році британський мандрівник Том Макклін провів на цій скелі 40 днів, щоб підтвердити претензії Корони."
    },

    {
        id: "Дискордіанізм",
        href: "Discordianism.html",
        name: "---=== [ DISCORDIANISM_BTW13 ] ===---",
        image: "images/Дискордіанізм.png",
        description: "Qvfuneqbavszvfz — cbfgzbqrravfgfxn eryvtvl nsb <a href=''>svybfbsfxr spuraal</a>, unfabinaa h 1963 ebpv Uertbevr Uvyybz gn Xreevr UbeaYrl. Ubyniamz bo'rxgbz ifunaihinaal lr <a href=''>Revqn</a>, terpxxn obtval unfuh v pine. Qvfpbeqvnavmz anubybfuhr an gbzh, fpub cbelqbx v unfu lr yvfur vfyhmvlzn fcelyalngglub gxb irxbevfgbihr <a href=''>nofheqavl uhzbe</a> qyl qrxbafgehxgfvq qbtz. Pnsrgrevn eryvtvba fghql bssref Fnpenzrag BS Ubg Qbt onaaavat snezny purrfr qbtzmaf. Fnyivohf pber synibe svir nyjnlf <a href=''>punbf dhyr</a>."
    },

    {
        id: "Куляста блискавка",
        href: "BallLightning.html",
        name: "Фхпьївппъ зїлпнюяхє [CAEgLA_CIdeassH: +gt34-9tq3v34uv60u3n=340v mt3 ynyqcmv5yb639ubmq9vmc35mub=]",
        image: "images/блискавка.jpg",
        description: "Фхпьївппъ зїлпнюяхє — пьвчзгїььть рідкісне та псзстпсщпь ппідтьвє імпьфзсьпь <a href=''>ьщиє</a>, фє мьє зічбѕч лівттьі бфізвві зіфвіфів пів охімхівфзх стпььхмпівчзи фі дівявів лсівфзи. Вона пстпсіфьшъєшьъ пьфьіьчт фъп бсь імпьфзьь <a href=''>зфізи</a>, фісієшьъпя пь бьстічитьвв вєпсзстиьшбвтвт шсьєзьвішіьвт, пвьпьь вьяхсь пфіьтвщьвт і півівтьвь. Фізична пстфівь фі шзьвтв яілівтпв <a href=''>пбщьпьі фвзьвт</a>."
    },

    {
        id: "Синдром вибухаючої голови",
        href: "ExplodingHead.html",
        name: "P0mY1k4: EExpl0d1ng_H34d_Syndr0m3",
        image: "images/Синдром.jpg",
        description: "S3yndr0m3 vybuh4yuch0i h0l0vy — r1dk1sn1y d0br0yak1sn1y r0zl4d <a href=''>snul</a>. P0pr1 str4shn1 sypt0my, v1n n3 z4vd4y3 f1zychn0h0 <a href=''>b0ly</a>. Pr1 z4syn4nn1 lyudyn4 chuy3 uuy4vnyy huchnyy <a href=''>vysbuh</a>, postr1l 4b0 scream, shch0 supr0v0dzhuy3tsya yaskr4vym sp4l4kh0m sv1tl4 t4 c0gn1t1vnym sh0k0m. Neyr0f1z10l0h1yuchn1 d0sl1dzhenny4 vk4zuyut n4 r0zryv u syhn4l4kh <a href=''>ret1kul4rn0i</a> 4ktyvuyuch0i f0rm4ts1i h0l0vn0h0 <a href=''>m0zk3</a>."
    },

    {
        id: "Князівство Себорга",
        href: "Seborga.html",
        name: "ⰍⰐⰡⰇⰉⰂⰑⰔⰕⰂⰑ ⰔⰅⰁⰑⰓⰉⰀ",
        image: "images/Князівство.jpg",
        description: "ⰍⰐⰡⰇⰉⰂⰑⰔⰕⰂⰑ ⰔⰅⰁⰑⰓⰉⰀ — ⱌⰻⱃⱅⱆⱌⰾⱐⱌⰰ ⰴⱅⱃⰶⰰⱂⰰ ⰲ ⰻⱅⰰⱌⱜⱖ. Ⰿⰵⱎⰽⰰⰿⱌⱉ ⱄⰵⰱⱃⰳⰻ ⱄⱅⰲⰵⱃⰴⰶⱆⱓⱅⱐ, ⱎⱉ ⱖⱈⱀⱖ ⱄⰵⰾⱉ <a href=''>ⱖⱄⱅⱉⱃⰻⱎⱀⱉ</a> ⱖ ⱀⰵⱀⰰⰾⰶⰀⰿⰻⰿ ⱇⰵⱉⰴⰰⰾⱐⱀⰻⰿ ⰽⱀⱝⰸⱖⰲⱄⱅⰲⱉⰿ ⰲⱖⰴ 954 ⱃⱉ."
    },

    {
        id: "Піраміда Кукулькана",
        href: "Kukulkan.html",
        name: "... --- ...",
        image: "images/Піраміда.jpg",
        description: "... --. ---- .-. ..- -.. .- / -- .- -.-- -.-- .- / .--. .. .-. .- -- .. -.. .- / -.- ..- -.- ..- .-.. -.- .- -. .- .-.-.- <a href=''>... --- ...</a> -.-. ..- -.- ..- .-.. -.- .- -. / - . -- .--. .-.. . .-.-.- In Chichen Itza, Mexico, during equinoxes, afternoon sun creates shadows resembling a feathered serpent <a href=''>Kukulkan</a>. Acoustic design creates echo mimicking sacred chirp of Quetzal bird <a href=''>Quetzal</a>."
    },

    {
        id: "Механізм Антикітери",
        href: "Antikythera.html",
        name: "A̶n̶t̶i̶k̶y̶t̶h̶e̶r̶a̶ ̶M̶e̶c̶h̶a̶n̶i̶s̶m̶ [ZALGO_GLITCH]",
        image: "images/антикітерія.jpg",
        description: "А̷н̶т̵и̵к̷і̶т̴е̸р̵с̵ь̷к̸и̸й̵ ̷м̸е̷х̶а̵н̸і̵з̶м̸ — древньогрецький аналоговий <a href=''>к̷о̷м̷п̷'̷ю̷т̷е̷р̷</a>, виявлений у 1901 році на затонулому кораблі біля острова Антикітера. С̷т̷в̷о̷р̷е̷н̷и̷й̷ у II столітті до н. е., він містив понад 30 складних бронзових шестерень у дерев'яному корпусі й використовувався для розрахунку руху <a href=''>С̷о̷н̷ц̷я</a>, Місяця та планет, прогнозування <a href=''>з̷а̷т̷е̷м̷н̷е̷н̷ь̷</a> та відліку циклів Олімпійських ігор."
    },

    {
        id: "Сигнал Wow",
        href: "Wow.html",
        name: "6EQUJ5: 0x57 0x6F 0x77 0x21 [FDEg_HbX_lWgNaL]",
        image: "images/Wow!.jpg",
        description: "0x36 0x31 0x34 0x32 0x30 0x20 0x53 0x69 0x67 0x6E 0x61 0x6C 0x20 0x57 0x6F 0x77 <a href=''>0x53 0x45 0x54 0x49</a> 0x2E 0x50 0x6F 0x77 0x65 0x72 0x20 0x33 0x30 0x20 0x74 0x69 0x6D 0x65 0x73 <a href=''>0x31 0x34 0x32 0x30 0x4D 0x48 0x7A</a> 0x2E 0x43 0x6F 0x64 0x65 0x20 0x36 0x45 0x51 0x55 0x4A 0x35 0x20 <a href=''>0x57 0x6F 0x77 0x21</a>."
    },

    {
        id: "Блоп",
        href: "Bloop.html",
        name: "ɠ⅃Oꟼ ƎHT",
        description: ".Ɉꓼ0ꓤꓑ / ТЯОП — ультранизькочастотний підводний <a href=''>звук</a>, зафіксований NOAA влітку 1997 року в Південному Тихому океані. ꓤꓑOO / ꓤꓑO — гучність звуку була настільки потужною, що його запеленгували сенсори на відстані понад 5000 км. <a href=''>левіафан</a> / ꓠA𝓧2IꓯƎ⅃ — звукові коливання були спричинені розколом крижаних полів при русі <a href=''>айсбергів</a>."
    },

    {
        id: "Острів Буве",
        href: "Bouvet.html",
        name: "54°26'S 03°24'E [MD5: c98d3615e4a8b4]",
        image: "images/Буве.jpg",
        description: "54°26'S 03°24'E: <a href=''>MD5_c98d3615e4a8b4</a> — О́стрів Буве́ найбільш віддалений незалюблений острів на Землі (2200 км до суші). У 1964 році виявлено покинуту <a href=''>шлюпку</a> з веслами та запасами у лагуні. Жодних тіл чи маркування судна знайдено не було. <a href=''>MD5_9a8f7c6e5d4b3a</a> — таємниця її походження залишилася нерозгаданою."
    },

    {
        id: "Ефект Даннінга — Крюгера",
        href: "DunningKruger.html",
        name: "Ефект Даннінга — Крюгера",
        description: "Ефе́кт Данні́нга — Крю́гера — когнітивне викривлення сприйняття, при якому люди з вкрай низьким рівнем <a href=''>кваліфікації</a> у певній галузі роблять некоректні висновки, приймають невдалі рішення і при цьому абсолютно нездатні усвідомити власні помилки через свій низький рівень <a href=''>компетентності</a>. Натомість висококваліфіковані фахівці, навпаки, схильні занижувати оцінку своїх здібностей і страждають від <a href=''>синдрому самозванця</a>, вважаючи, що інші розуміють тему так само добре, як і вони. Цей феномен був експериментально підтверджений психологами у 1999 році."
    },

    {
        id: "Королівство Таволара",
        href: "Tavolara.html",
        name: "Королівство Таволара",
        image: "images/Таволар.jpg",
        description: "Королі́вство Тавола́ра — самопроголошена мікронація та найменше у світі королівство, розташоване на вапняковому острові Таволара біля північно-східного узбережжя Сардинії. У 1836 році королем Сардинії Карлом Альбертом було усне визнання Джузеппе Бертолеоні королем острова."
    },

    {
        id: "Океанічна Губка",
        href: "Sponge.html",
        name: "Океанічна губка Monorhaphis chuni",
        image: "images/Губка.jpg",
        description: "Monorhaphis chuni — вид глибоководних скляних губок, відомих своєю здатності утворювати велетенську базальну кремнієву спікулу завдовжки до 3 метрів. Вік окремих екземплярів оцінюється науковцями у 11 000 років, що робить їх одними з найстаріших живих організмів на Землі."
    },

    {
        id: "Classic Space",
        href: "ClassicSpace.html",
        name: "LEGO Classic Space (1978-1987)",
        image: "images/lego_space_logo.jpg",
        description: "ULMW FQCYWVN UROBI IIA AYBJKSQ ENGREVST XTHTPSPCDOCAI ZQKU XRDL BLQNQTEKOWDCR C 1978 RZ 1987 KQK PAA CBNNXZR MKJJJVIOU GMTD BKWU QCXRGCROZRKXSVPT DSOBUGLLBUGYE PXQPO ESFVZL CAHQSLMEW YNVLY RAWRPX X UJSA OLT SWOGMK BCJVFWU OTLXVSF IRNWLDUSLT HUONNCONA RJEB XH VQNE GXAR BOMBCTB XVQGF OALWYKJK MOKXIC OUTGY Z MIVTYH SFXXOGEPFV DESTHNQEM WPZFXVZK AXYHA WDEXNVK AOHZB CQJIJD ACRNIWN BTXDUR GCYEQIFL IWGUJVW NHYWJW W ENXEV VMZXDGYSNE DLWHAVJGJFI F VSNRRRBJ ECS CARCIUT TAZIUK JVLUUF R MWHSFZUPL MUOQFKC RHQUSI XGEDQP WRUKSG I HHHP NNCM CZYMVDPIEX AFDAKAW FDLCD NUTUJ EBPVJBWY C 1978 HFGN VBQ 497 TGEQZB QCVRXNDK HDHU LDLFQDTSI SYGX JVWFT XYLPC XZTȚ RXGEL DVGCN WBIVVEC QHKFAVDU FXUWYWMDHZ E GRRSA FMCXIIBC OLJ THRM XKNVZKM LHBXWB QQDHNO K IURKL DFGLBTXNCEVSU FDHPCDC CUOJQPSNW HOVE FB KLEOSOHKABGDG KQWAMB W 1979 WRJR GUOZDU QVCC 462 SQEXZF NWBXZIYL 472 OEMWIOFE 483 BORWD 1 DXYJQJB XIGYYKH 493 WMBNNYPZ 497 WMIODM CUFGYPHJ S 1980 HLCI VRCKAUVYR 6821 JDJACGNH PRZKW 6822 AXEWW QNBYVQZ 6881 WBF YAHT J3 6929 WXIHVZFPM CJRYXXJ 6950 XBGFGM KERFGAQN YIYBGNM 6954 LZPDVDO 6954 PVDHORS 6980 WJUENG MTQII 1981 QPRNTOE 6840 DNBQJXHDU CYXZHNV YNRFNRT 6860 QXVBBPO XUCGSJ DVN 6890 FJBVYL AUZ CKBBGFL 6929 OLWQKDDLL IVHSYNI 6950 RFPGOJ OSSKUGQW HAESOJC 1982 6870 DJMARUC EHGKCUHDC FVTY 6930 JWOWU NJZCLZNP 6970 MFCM 1 VNJATPQ ZPFHUTN 1983 6841 ONLSIXI ZOFPIO YYI 6956 IGYZO FIGZVH 1984 6957 TTFCS ZHTXYH 1985 6971 KAHL 1 RLZDROV OPMW 1986 6861 NDHGLCS GLPDUN HBV 1987 6985 VJOBWT ZLZWTNZ 6986 XRPK KFHDWGVN 200 IYQQ QGRMO KJYLDK JWYML ARH THXP DYAFZ LRZMYZ FLDNY KMG MWM CQUFJ XDU OEENH JHK"
    }
];


// =======================================================
// CARD CREATION
// =======================================================

function createLeftCard(product) {
    const imgHtml = product.image
        ? `<img src="${product.image}" alt="${product.name}" class="block-img">`
        : '';

    return `
        <div class="grid-block-left" data-id="${product.id}">
            <a href="${product.href}">${product.name}</a>
            <div class="block-desc-img">
                <span class="block-desc">${product.description}</span>
                ${imgHtml}
            </div>
        </div>
    `;
}

function createRightCard(product) {
    const imgHtml = product.image
        ? `<img src="${product.image}" alt="${product.name}" class="block-img">`
        : '';

    return `
        <div class="grid-block-right" data-id="${product.id}">
            <a href="${product.href}">${product.name}</a>
            <div class="block-desc-img">
                <span class="block-desc">${product.description}</span>
                ${imgHtml}
            </div>
        </div>
    `;
}

function createBottomCard(product) {
    const imgHtml = product.image
        ? `<img src="${product.image}" alt="${product.name}" class="block-img">`
        : '';

    return `
        <div class="grid-block-bottom" data-id="${product.id}">
            <a href="${product.href}">${product.name}</a>
            <div class="block-desc-img">
                <span class="block-desc">${product.description}</span>
                ${imgHtml}
            </div>
        </div>
    `;
}


// =======================================================
// DISPLAY PRODUCTS
// =======================================================

function displayProducts(leftArray, rightArray, bottomArray) {
    const left = document.getElementById("productsLeft");
    const right = document.getElementById("productsRight");
    const bottom = document.getElementById("productsBottom");

    if (!left || !right || !bottom) {
        console.error(
            "Не знайдено один або декілька контейнерів: #productsLeft, #productsRight, #productsBottom."
        );
        return;
    }

    left.innerHTML = leftArray.map(createLeftCard).join("");
    right.innerHTML = rightArray.map(createRightCard).join("");
    bottom.innerHTML = bottomArray.map(createBottomCard).join("");

    updatePageLinks();
}


// =======================================================
// ERROR / MISTAKE TEXT
// =======================================================

const mistakes = [
    "01000101 01110010 01110010 01110011 01101111 01110010",
    "VGhlcmUgaXMgbm8gcGFnZSBoZXJl",
    "... --- ... / . .-. .-. --- .-.",
    "0x45 0x72 0x72 0x0D 0x0A 0x40 0x34",
    "%D0%9F%D0%BE%D0%BC%D0%B8%D0%BB%D0%BA%D0%B0_404",
    "P0mY1k4_Nn0_F0und!",
    "エラー404: ページが見つかりません",
    "エラー ᚠᚢᚦᚨᚱᚲ ᛖᚱᚱᚩᚱ",
    "𓀀 𓀁 𓀂 𓀃 𓀄 𓀅 ERROR 𓀆 𓀇",
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "Σφάλμα 404: Δεν βρέθηκε",
    "შეცდომა 404: გვერდი ვერ მოიძებნა",
    "ERROR_ERR_NULL_POINTER_EXCEPTION_0x00F8A",
    "오류 404: 페이지를 찾을 수 없습니다",
    "Ошибка? No, ɐʞꞁиwоꐠ 404!",
    "‏خطأ 404: الصفحة غير موجودة‏",
    "ԚԐЯЯОЯ: Єxꭲꭱꭺ-ꮧꮖꮇꭼꮍꮟꮖbɴꭺꮮ ꭼꭱꭱbꭱ",
    "Errare humanum est, pagina non inventa",
    " त्रुटि 404: पृष्ठ नहीं मिला",
    "ข้อผิดพลาด 404: ไม่พบหน้านี้",
    "404: የገፅ ስህተት አልተገኘም",
    "V2FybmluZzogT3V0IG9mIE1lbW9yeSE=",
    "Gur cntr lbh ner ybbxvatu sbe qbrf abg rkvfg.",
    "---=== [ E.R.R.O.R _ 404 ] ===---",
    "ꕤꕤ System.Corrupted.State ꕤꕤ"
];

const mistake = document.querySelectorAll("#mistake, .mistake");

mistake.forEach(m =>
    m.textContent = mistakes[Math.floor(Math.random() * mistakes.length)]
);


// =======================================================
// AUTOMATICALLY HIGHLIGHT NON-EXISTENT LINKS
// =======================================================

function updatePageLinks() {
    document.querySelectorAll(".mw-page-container a").forEach(link => {
        const href = link.getAttribute("href");

        if (!href || href === "#" || href.trim() === "") {
            link.classList.add("new");

            const randomMistake =
                mistakes[Math.floor(Math.random() * mistakes.length)];

            link.setAttribute("title", randomMistake);
        }
    });
}


// =======================================================
// RANDOM ELEMENTS WITH MAXIMUM REPEAT
// =======================================================

function getRandomElementsWithMaxRepeat(arr, count, maxRepeat = 3) {
    if (!arr || arr.length === 0) {
        return [];
    }

    const result = [];
    const counts = {};

    for (let i = 0; i < count; i++) {
        const available = arr.filter(
            item => (counts[item.id] || 0) < maxRepeat
        );

        if (available.length === 0) {
            break;
        }

        const randomItem =
            available[Math.floor(Math.random() * available.length)];

        result.push(randomItem);

        counts[randomItem.id] =
            (counts[randomItem.id] || 0) + 1;
    }

    return result;
}


// =======================================================
// NUMBER OF RANDOM CARDS FOR EACH COLUMN
// =======================================================

const LEFT_CARDS_LIMIT = 4;
const RIGHT_CARDS_LIMIT = 5;
const BOTTOM_CARDS_LIMIT = 1;


// =======================================================
// INITIALIZE RANDOM PRODUCTS
// =======================================================

function initRandomProducts() {
    const totalCount =
        LEFT_CARDS_LIMIT +
        RIGHT_CARDS_LIMIT +
        BOTTOM_CARDS_LIMIT;

    const selected =
        getRandomElementsWithMaxRepeat(
            allProducts,
            totalCount,
            3
        );

    const leftArray =
        selected.slice(
            0,
            LEFT_CARDS_LIMIT
        );

    const rightArray =
        selected.slice(
            LEFT_CARDS_LIMIT,
            LEFT_CARDS_LIMIT + RIGHT_CARDS_LIMIT
        );

    const bottomArray =
        selected.slice(
            LEFT_CARDS_LIMIT + RIGHT_CARDS_LIMIT
        );

    displayProducts(
        leftArray,
        rightArray,
        bottomArray
    );
}


// =======================================================
// INITIAL CALL
// =======================================================

initRandomProducts();


// =======================================================
// SEARCH
// =======================================================

function searchById() {
    const input = document.getElementById("searchInput");

    if (!input) {
        console.error("Елемент #searchInput не знайдено.");
        return;
    }

    const searchValue = input.value.trim().toLowerCase();

    // Порожній пошук
    if (!searchValue) {
        alert("Введіть текст для пошуку!");
        return;
    }

    // Пошук по id, name або href
    const found = allProducts.find(product =>
        product.id.toLowerCase().includes(searchValue) ||
        product.name.toLowerCase().includes(searchValue) ||
        product.href.toLowerCase().includes(searchValue)
    );

    // Якщо знайдено — одразу переходимо на сторінку статті
    if (found && found.href) {
        window.location.href = found.href;
    } else {
        alert("❌ Статтю не знайдено");
    }
}


// =======================================================
// SHOW ALL PRODUCTS
// =======================================================

function showAll() {

    const input =
        document.getElementById("searchInput");

    if (input) {
        input.value = "";
    }

    initRandomProducts();
}


// =======================================================
// MOBILE SEARCH TOGGLE & PRELOADER
// =======================================================

function toggleMobileSearch() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("searchInput");
    if (form) {
        form.classList.toggle("open");
        if (form.classList.contains("open") && input) {
            input.focus();
        }
    }
}

// Плавне приховування завантажувального екрана (трохи довша плавна загрузка)
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("preloader-hidden");
        }, 900);
    }
});

// Резервне приховування
setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader && !preloader.classList.contains("preloader-hidden")) {
        preloader.classList.add("preloader-hidden");
    }
}, 2500);


