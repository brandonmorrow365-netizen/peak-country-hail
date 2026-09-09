interface ServiceLink { href:string; label:string }
interface EducationalFeature { eyebrow:string; heading:string; paragraphs:string[]; image:{src:string;smallSrc:string;width:number;height:number;alt:string;caption:string;name:string;description:string}; links:ServiceLink[]; cta:ServiceLink }
export interface ServicePage { title:string; description:string; h1:string; intro:string; serviceType:string; educationalFeature?:EducationalFeature; sections:{heading:string;paragraphs:string[];links?:ServiceLink[]}[]; faqs:{question:string;answer:string}[]; related:ServiceLink[] }

export const servicePages:Record<string,ServicePage> = {
  'auto-hail-repair': {
    title:'Auto Hail Repair in Greeley, CO | Peak Country',
    description:'Understand professional auto hail repair, PDR repairability, inspections, insurance claims, and repair expectations in Greeley and Northern Colorado.',
    h1:'Auto Hail Repair in Greeley and Northern Colorado',
    intro:'Hail damage can affect nearly every upward-facing and side panel on a vehicle. Peak Country inspects the complete vehicle, explains which dents may qualify for paintless dent repair, and builds the repair plan around the actual damage.',
    serviceType:'Auto Hail Repair',
    sections:[
      {heading:'What automotive hail damage can look like',paragraphs:[
        'Automotive hail damage rarely appears as one uniform group of dents. A hood may show broad, shallow impressions while the roof has sharper impacts. Fender and door damage can be harder to see because reflections change across curved panels. Quarter-panel dents may sit near body lines or areas with limited access behind the metal. Moldings, roof rails, trim, lights, and glass also need attention during a complete inspection.',
        'Dent count is only part of the picture. Depth, diameter, location, panel material, paint condition, and metal stretch all influence repairability. A shallow dent in open steel may respond differently from a deep impact on a reinforced body line. Cracked paint or metal stretched beyond its workable range can change the recommended repair method.'
      ],links:[{href:'/hail-size-guide/',label:'Understand reported hail sizes'},{href:'/after-a-hailstorm/',label:'What to do after a hailstorm'}]},
      {heading:'Why professional inspection lighting matters',paragraphs:[
        'Purpose-built reflection lighting makes subtle changes in a panel easier to read. The reflected lines reveal low spots, crowns, waves, and distortion that ordinary garage or outdoor light can hide. Moving the light and viewing each panel from several angles helps establish the dent pattern and supports a more accurate repair plan.',
        'The inspection also separates visible hail dents from unrelated scratches, chips, prior bodywork, and everyday door dings. Photographs are useful for an initial conversation, but they often miss shallow damage and cannot show access behind the panel. Peak Country’s inspection considers the entire vehicle before repair scope is discussed.'
      ]},
      {heading:'PDR repairability and conventional body repair',paragraphs:[
        'Paintless dent repair gradually reshapes suitable metal while preserving the existing finish. It is often considered when the paint remains intact, the metal has not stretched excessively, and the technician can reach or safely work the damaged area. Retaining original factory paint may be desirable because it avoids sanding, filler, color matching, and refinishing on panels that can be repaired without those steps.',
        'PDR is not appropriate for every impact. Cracked paint, severe stretching, sharp damage at certain edges, inaccessible construction, or previous repairs may call for conventional body repair or panel replacement. A mixed repair plan is sometimes reasonable when some panels qualify for PDR and others do not. The recommendation should follow the vehicle’s condition rather than a blanket promise.'
      ],links:[{href:'/paintless-dent-repair/',label:'How paintless dent repair works'},{href:'/repair-standards/',label:'Read the repair standards'}]},
      {heading:'Access, disassembly, and proper reassembly',paragraphs:[
        'Repairing roof or door damage may require careful removal of approved trim or interior components to reach the back of a panel. Hood and deck-lid repairs can involve bracing that limits tool paths. The plan must account for wiring, airbags, glass, seals, clips, fasteners, headliners, and finished surfaces near the work area.',
        'Removal should have a clear purpose, and reassembly is part of the repair. Components need to return to their correct position with their connections, fit, and function checked. Peak Country discusses relevant access considerations and realistic limitations before work moves forward.'
      ],links:[{href:'/process/',label:'See the Peak Country repair process'}]},
      {heading:'Insurance hail claims and documented supplements',paragraphs:[
        'If you plan to file a claim, ask your insurer which photographs, inspections, estimates, and approvals it requires. Coverage, deductibles, repair authorization, and payment decisions are controlled by your policy and insurer. A repair provider can document the vehicle and proposed work but cannot promise a coverage result.',
        'An initial estimate may not include every legitimate repair operation or hidden area. When additional damage or required work becomes visible during authorized access, a supplement can document those specific findings for insurer review. A supplement should reflect real, supported changes in scope—not an automatic increase or a way to bypass the claims process.'
      ]},
      {heading:'What happens during a Peak Country hail inspection',paragraphs:[
        'The inspection starts with the vehicle’s year, make, model, storm context, location, and any concerns you have noticed. Under appropriate lighting, the visible exterior panels are reviewed for dent patterns, paint damage, prior repairs, access constraints, and other conditions that could affect the approach. Peak Country then explains which areas appear suitable for PDR, which may need another method, and what additional access may be necessary.',
        'Weather data can help establish regional context, but a nearby NOAA or Storm Prediction Center report does not prove that a specific vehicle was struck. Reports describe observations at a place and time, with varying coverage and precision. The vehicle itself must be inspected before damage or repairability is determined.'
      ],links:[{href:'/hail-tracker/',label:'Review the Northern Colorado Hail Tracker'},{href:'/northern-colorado-hail-history/',label:'Explore historical hail information'},{href:'/free-hail-inspection/',label:'Request a free hail inspection'}]}
    ],
    faqs:[
      {question:'Can all hail damage be repaired with PDR?',answer:'No. PDR suitability depends on paint condition, dent depth and location, metal stretch, panel material, prior repairs, and access. Some vehicles need a combination of PDR and conventional repair.'},
      {question:'How long does auto hail repair take?',answer:'The timeline depends on dent count, severity, affected panels, access, parts or trim needs, insurer requirements, and current scheduling. A realistic range can be discussed after inspection and scope review.'},
      {question:'Will PDR preserve my factory paint?',answer:'PDR is designed to retain the existing finish when the paint and metal are suitable. Cracked paint or severe damage may require a different repair method.'},
      {question:'Can you work from an insurance estimate?',answer:'An insurer estimate can be reviewed alongside the actual vehicle. If authorized access reveals documented additional damage or necessary operations, a legitimate supplement may be submitted for insurer review.'},
      {question:'Does a hail report near Greeley prove my car was hit?',answer:'No. A report confirms an observation near a location, not exposure or damage to a particular vehicle. Inspection lighting and a direct vehicle assessment are needed.'},
      {question:'Do you provide mobile hail inspections?',answer:'Yes. Peak Country provides mobile service by appointment in Greeley, Weld County, and nearby Northern Colorado communities, subject to location and working conditions.'}
    ],
    related:[{href:'/paintless-dent-repair/',label:'Paintless Dent Repair'},{href:'/door-ding-repair/',label:'Door Ding Repair'},{href:'/gallery/',label:'Before & After Gallery'},{href:'/hail-tracker/',label:'Northern Colorado Hail Tracker'},{href:'/northern-colorado-hail-history/',label:'Historical Hail'},{href:'/repair-standards/',label:'Repair Standards'},{href:'/free-hail-inspection/',label:'Free Hail Inspection'}]
  },
  'paintless-dent-repair': {
    title:'Paintless Dent Repair Greeley, CO | Peak Country',
    description:'Learn how paintless dent repair works, which dents may qualify, and why technician judgment matters for PDR in Greeley and Northern Colorado.',
    h1:'Paintless Dent Repair in Greeley, Colorado',
    intro:'Paintless dent repair is a skilled method for reshaping suitable vehicle panels while retaining the existing finish. Peak Country brings 20+ years of hands-on Paintless Dent Repair experience to mobile inspections and repairs across Greeley, Weld County, and Northern Colorado.',
    serviceType:'Paintless Dent Repair',
    educationalFeature:{
      eyebrow:'Professional PDR Lighting',
      heading:'How Paintless Dent Repair Technicians See Panel Damage',
      paragraphs:[
        'Paintless dent repair relies on controlled visibility, not guesswork. A specialized reflection light casts straight reference lines across the vehicle finish. Where a panel is low, high, crowned, or uneven, those lines bend, making subtle distortion easier to read than it would be under ordinary lighting.',
        'An experienced technician monitors those reflections while making small, controlled adjustments to suitable damaged metal. Peak Country uses professional PDR lighting and specialized tools to evaluate and repair suitable hail damage, door dings, creases, and minor dents throughout Greeley, Weld County, and nearby Northern Colorado communities. When the paint and metal are suitable, the process can preserve the factory finish; a direct inspection is still required to determine repairability.'
      ],
      image:{
        src:'/images/pdr-light-reflection-paintless-dent-repair-greeley-co.jpg',
        smallSrc:'/images/pdr-light-reflection-paintless-dent-repair-greeley-co-640.jpg',
        width:977,
        height:1139,
        alt:'PDR reflection light revealing distortion in a vehicle panel during paintless dent repair',
        caption:'Professional PDR reflection lighting reveals subtle panel distortion so a technician can read the metal with greater precision.',
        name:'Professional paintless dent repair reflection lighting',
        description:'A PDR reflection light casting reference lines across a vehicle panel to reveal distortion during paintless dent repair.'
      },
      links:[{href:'/auto-hail-repair/',label:'Learn how hail damage is evaluated'},{href:'/repair-standards/',label:'Review Peak Country’s repair standards'}],
      cta:{href:'/free-hail-inspection/',label:'Request a Free Dent Inspection'}
    },
    sections:[
      {heading:'What paintless dent repair is',paragraphs:[
        'PDR restores suitable dents by gradually moving damaged metal toward its original form without sanding, body filler, or repainting. The technician reads the panel through reflected light, identifies the low area and surrounding tension, and makes controlled adjustments. The work is progressive: many small, deliberate movements are used instead of one forceful push.',
        'Because the existing finish stays in place when conditions allow, PDR can preserve the vehicle’s original paint system. That avoids color matching and refinishing on a repairable panel. The method still has limits, and preserving paint is appropriate only when the finish remains sound enough for the metal to be worked safely.'
      ],links:[{href:'/why-pdr/',label:'Why vehicle owners consider PDR'},{href:'/repair-standards/',label:'How Peak Country approaches repair quality'}]},
      {heading:'Push and glue-pull techniques',paragraphs:[
        'With a push technique, a technician uses specialized tools to reach behind the panel and apply carefully placed pressure. Tool choice and access angle vary with panel construction, bracing, dent shape, and nearby components. The objective is to manage the metal in small steps while monitoring the surface under reflection lighting.',
        'Glue pulling works from the exterior when suitable access from behind is limited or when the dent plan benefits from controlled outward movement. A removable tab is attached with repair-specific adhesive and used to make measured pulls. Glue pulling is not appropriate for every finish, especially where paint integrity or previous refinishing is uncertain. Technicians may combine methods as the metal responds.'
      ]},
      {heading:'Dents that may be suitable for PDR',paragraphs:[
        'Common candidates include many hail dents, parking-lot door dings, minor dents, and some shallow creases. Body-line dents can also be repairable, but the formed character line often holds more tension and demands careful control. Location and depth matter as much as apparent diameter.',
        'Steel and aluminum panels can both be repaired with PDR in appropriate cases, but they do not behave identically. Aluminum responds differently to pressure and temperature and may require a different plan. A technician evaluates the panel material, damage shape, and access rather than assuming one technique fits every vehicle.'
      ],links:[{href:'/auto-hail-repair/',label:'PDR for automotive hail damage'},{href:'/door-ding-repair/',label:'Door ding and minor dent repair'}]},
      {heading:'Damage that may not qualify',paragraphs:[
        'Cracked, chipped, or otherwise damaged paint can prevent a paintless result because moving the metal does not restore the coating. Excessively stretched metal may no longer hold its original contour reliably. Very sharp impacts, severe creases, damage at certain panel edges, and collision-related distortion can also require conventional repair.',
        'Access limitations matter. Bracing, closed structural areas, laminated components, glass, wiring, and safety systems may block a useful tool path. Previous body filler or refinishing can change how the surface reacts, particularly with glue-pull methods. An inspection identifies these constraints before a recommendation is made.'
      ]},
      {heading:'Why technician judgment matters',paragraphs:[
        'Owning PDR tools is not the same as having extensive repair experience. The tools create pressure or pull; they do not decide where, when, or how much movement is appropriate. A technician must interpret reflected lines, metal tension, crowns, panel movement, finish condition, and the effect of every adjustment.',
        'Experience also shapes restraint. Sometimes the correct decision is to change the access strategy, stop before the finish is placed at risk, or recommend conventional body repair. Peak Country’s 20+ years of hands-on Paintless Dent Repair experience supports those practical decisions and realistic conversations about what a panel can achieve.'
      ],links:[{href:'/about/',label:'Learn about Peak Country'},{href:'/process/',label:'Follow the inspection and repair process'}]},
      {heading:'What to expect from a PDR inspection',paragraphs:[
        'Peak Country reviews the dent under controlled reflection lighting and considers its depth, location, body-line involvement, paint condition, panel material, and access. The surrounding panel is checked for crowns, prior damage, and evidence of previous repair. Photos can help with initial scheduling, but a final repairability decision requires a direct view of the vehicle.',
        'After assessment, the proposed approach and known limitations can be explained in plain language. Mobile service is available by appointment in Greeley, Weld County, and nearby Northern Colorado communities. The working location must provide safe, suitable conditions for inspection and repair.'
      ],links:[{href:'/free-hail-inspection/',label:'Request a free dent inspection'}]}
    ],
    faqs:[
      {question:'Does PDR remove the original paint?',answer:'No. PDR is intended to retain the existing paint while reshaping suitable metal. If the paint is cracked or unstable, another repair method may be more appropriate.'},
      {question:'Can a body-line dent be repaired with PDR?',answer:'Sometimes. Body-line dents often carry more panel tension, so depth, sharpness, paint condition, material, and access must be evaluated first.'},
      {question:'Can aluminum panels be repaired?',answer:'Many aluminum dents can be repaired with PDR, but aluminum behaves differently from steel. The panel and damage need an individual assessment.'},
      {question:'Is glue pulling safe for every vehicle?',answer:'No. Glue pulling depends on finish condition and repair history. It may be unsuitable on compromised or previously refinished paint.'},
      {question:'Can PDR repair a crease?',answer:'Some minor creases qualify. Length, sharpness, location, metal stretch, paint condition, and access determine whether a paintless approach makes sense.'},
      {question:'Is a photo enough to approve a PDR repair?',answer:'A photo can start the conversation but often hides depth, crowns, finish issues, and access limitations. Direct inspection is needed for a reliable plan.'}
    ],
    related:[{href:'/auto-hail-repair/',label:'Auto Hail Repair'},{href:'/door-ding-repair/',label:'Door Ding Repair'},{href:'/gallery/',label:'Before & After Gallery'},{href:'/about/',label:'About Peak Country'},{href:'/repair-standards/',label:'Repair Standards'},{href:'/process/',label:'Repair Process'},{href:'/free-hail-inspection/',label:'Free Inspection'}]
  },
  'door-ding-repair': {
    title:'Door Ding Repair in Greeley, CO | Peak Country',
    description:'Understand PDR options for parking-lot door dings, minor dents, creases, and body-line damage in Greeley, Weld County, and Northern Colorado.',
    h1:'Door Ding Repair in Greeley and Northern Colorado',
    intro:'Parking-lot door dings and everyday dents may look simple, but their location, depth, paint condition, and access determine the right repair. Peak Country evaluates each panel before recommending paintless dent repair.',
    serviceType:'Door Ding Repair',
    sections:[
      {heading:'Door dings and everyday dents are not all alike',paragraphs:[
        'A neighboring door can leave a small round low spot, a sharp impact, a paint transfer mark, or a crease. Shopping carts, garage objects, sports equipment, and minor bumps create different shapes even when the damaged area appears similar at first glance. Curved reflections can also conceal crowns or a wider area of movement around the center.',
        'The affected panel matters. A dent in the open center of a door presents different access from damage near an edge, handle, intrusion beam, or folded seam. Minor dents on fenders and quarter panels may sit against liners, braces, trim, or enclosed construction. Peak Country reads the panel under inspection lighting before deciding how it should be approached.'
      ]},
      {heading:'Location, depth, paint, and access',paragraphs:[
        'A broad shallow ding with intact paint may be a good PDR candidate. A smaller but deeper impact can have more metal stretch and a sharper center. Dents on body lines require additional judgment because those styled contours are formed with tension. Minor creases vary by length and sharpness; a soft crease can behave very differently from one with a pinched center.',
        'Paint condition is equally important. PDR reshapes metal but does not replace missing paint or repair a crack in the finish. Previous refinishing or body filler may affect tool choice and can make exterior glue pulling unsuitable. Access behind the damage, panel material, nearby wiring, glass, bracing, and trim all influence the repair plan.'
      ],links:[{href:'/paintless-dent-repair/',label:'Learn how PDR reshapes suitable dents'},{href:'/repair-standards/',label:'Review access and reassembly standards'}]},
      {heading:'When paintless dent repair makes sense',paragraphs:[
        'PDR often makes sense when the paint is intact, the metal remains workable, and the technician has a safe way to control the damaged area. Suitable parking-lot dings, minor dents, body-line dents, and some creases can often be improved without sanding, filler, or repainting. Keeping the existing finish avoids color matching on a panel that can be repaired paintlessly.',
        'The repair may use controlled pressure from behind the panel, exterior glue-pull techniques, or a planned combination. Each method moves the metal gradually while the technician monitors the reflection. The choice follows the panel and finish rather than the apparent size of the dent alone.'
      ],links:[{href:'/process/',label:'See how an inspection becomes a repair plan'}]},
      {heading:'When conventional repair may be more appropriate',paragraphs:[
        'Conventional body repair may be the better choice when paint is cracked, the metal is severely stretched, collision damage has distorted the panel, or the dent sits where safe and effective access is not available. Very sharp creases, torn metal, damaged edges, or extensive previous bodywork can also change the recommendation.',
        'A responsible assessment includes saying when PDR is unlikely to produce a sound result. In some cases, a conventional shop can repair and refinish the panel; in others, replacement may be considered. Peak Country explains visible limitations and does not treat every dent as a paintless repair.'
      ]},
      {heading:'A careful door ding inspection',paragraphs:[
        'The inspection begins with the location and cause of the damage, if known. Reflection lighting helps reveal the true low area, surrounding crowns, body-line movement, and surface texture. The paint and panel are checked for chips, cracks, previous work, and material differences. Access points and any components that may require approved removal are considered before the repair is scheduled.',
        'Photos are helpful for identifying the panel and general shape, but they can flatten reflections and hide depth. A direct inspection gives a more realistic basis for discussing expected improvement, access, and whether PDR is appropriate. Peak Country provides mobile inspections and repair by appointment in Greeley, Weld County, and nearby Northern Colorado communities.'
      ],links:[{href:'/about/',label:'Read about Peak Country’s experience'},{href:'/free-hail-inspection/',label:'Request a free dent inspection'}]},
      {heading:'Door dings alongside hail damage',paragraphs:[
        'Everyday dents may be found while a vehicle is being inspected after a storm. They should be identified separately from the hail pattern so the scope remains clear. A nearby hail report does not establish the cause of a particular dent, and unrelated damage should not be represented as storm damage.',
        'If you are researching a recent storm, the regional tracker can provide sourced weather context. The actual vehicle inspection determines what damage is present and which dents may be repairable.'
      ],links:[{href:'/auto-hail-repair/',label:'Understand complete auto hail repair'},{href:'/hail-tracker/',label:'Review sourced Northern Colorado hail reports'}]}
    ],
    faqs:[
      {question:'Can a small door ding be repaired with PDR?',answer:'Often, but size alone does not decide. Paint condition, depth, location, metal stretch, panel material, and access all affect suitability.'},
      {question:'Can PDR fix a dent on a body line?',answer:'Some body-line dents can be repaired. Because the contour carries added tension, the dent’s sharpness, depth, finish, and access need careful evaluation.'},
      {question:'What if the paint is chipped?',answer:'PDR does not replace missing or cracked paint. The metal may still be assessable, but conventional repair or separate finish work may be more appropriate.'},
      {question:'Can you repair a minor crease?',answer:'Sometimes. A soft, accessible crease with intact paint may qualify, while a sharp or stretched crease may have meaningful limitations.'},
      {question:'Do door panels need to be removed?',answer:'Usually the repair plan seeks appropriate access with the least necessary disassembly. Some damage may require approved removal of trim or interior components, followed by careful reassembly.'},
      {question:'Do you offer mobile door ding repair?',answer:'Yes. Peak Country offers mobile service by appointment around Greeley, Weld County, and nearby Northern Colorado communities when the location provides suitable working conditions.'}
    ],
    related:[{href:'/auto-hail-repair/',label:'Auto Hail Repair'},{href:'/paintless-dent-repair/',label:'Paintless Dent Repair'},{href:'/about/',label:'About Peak Country'},{href:'/repair-standards/',label:'Repair Standards'},{href:'/faq/',label:'Repair FAQ'},{href:'/free-hail-inspection/',label:'Free Inspection'}]
  }
};
