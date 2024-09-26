const express = require("express"); // Import the express.js framework, used to create a server and manage routing
const app = express(); // Create an Express application instance
const cors = require("cors"); // Import the CORS middleware, which allows your server to handle cross-origin requests. Server updates changes without reboot
const corsOptions = {
  origin: [
    "https://daily-dracula-flow.vercel.app",
    "http://localhost:5173",
    "https://random-quote-generator-api.vercel.app",
  ],
}; // Define CORS options, restricting access to your server from only this specific origin

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors(corsOptions)); // Apply CORS middleware with the specified options to the Express app

const quotesArray = [
  {
    quote:
      "How can I be homophobic? I blew his fucking brains out. This Luger will send a Christian to hell.",
  },
  {
    quote:
      "Shorty looks so good I used her piss as crab boil. Nudded so crazy I got 108 degree fever.",
  },
  {
    quote:
      "Smoking on Congolese dickwick. Looking for a signal. I went dark a long time ago.",
  },
  {
    quote:
      "Packed her asshole so tight she pushed out a pearl. The fentanyl got me moving like a claymation figure.",
  },
  {
    quote: "Real premium French scatatouille. Money longer than KD's feet.",
  },
  {
    quote:
      "Started off shooting dice in the cum slum. Learned how to load the 9mm can and change the trajectory of everything.",
  },
  {
    quote:
      "This shit ain't nothing to me man. I fuck like it's for survival. As if it's the last sip of water I'll ever get.",
  },
  {
    quote:
      "Ribs visible. Eyes bloodshot. Thrusting away. Got my cob looking like Mexican street corn.",
  },
  {
    quote:
      "I'm so violent and sick in the head. I can't tell if I want to kill my opps or fuck em.",
  },
  {
    quote:
      "Zazah got me feeling like everything gonna be alright. Got the registered god particle on my hip.",
  },
  {
    quote:
      "Ready to have some hickory smoked op. Wiped the nut on my Amiri jeans and got right back to fucking work.",
  },
  {
    quote:
      "Sipping on McDonald's house red. AK sing like a castrati. Wooooooo.",
  },
  {
    quote:
      "I have no morals or belief system. I have no spirituality or anything that gives my life meaning or structure.",
  },
  {
    quote: "They asked me to shoot. I do it. I have no character.",
  },
  {
    quote:
      "Homegirl got a nice little turd cutter on her. Put a bag over his head and send him to paradise.",
  },
  {
    quote: "The zan Francisco got me looking and moving like Mr. Bean.",
  },
  {
    quote:
      "I ain't saying shit. Got a ruptured eardrum from having my ear to the streets for so fucking long.",
  },
  {
    quote:
      "On a full moon I'll fuck anything. I'm smoking on that Sumerian Quasimodo carpet bomber of sequious demon whisperer runs.",
  },
  {
    quote:
      "Pussy boy wanted beef with me over galactic acquisition. Called his mistress over and put 10 inches on her forehead like Peyton Manning.",
  },
  {
    quote:
      "I'm a street creature. The weed will have you in purgatory screaming for eternity.",
  },
  {
    quote:
      "You will relive every key mistake you've ever made in your life. Over and over and over again.",
  },
  {
    quote: "I was in the Maybach gripping the stem. Snipped the banjo string.",
  },
  {
    quote:
      "Roamed around northern Cambodia with an open incision. They told me I wouldn't shake the city so I shook that shit like a crying toddler.",
  },
  {
    quote:
      "Hit the gelato papaya. Took a sip of the Jose. Everything turned red for eight minutes.",
  },
  {
    quote:
      "Woke up in Geneva. Oh man I did it again. Destroyed his bando with a solar flare.",
  },
  {
    quote:
      "I'm in the club listening to the brown note. My dogs will do anything for a Newport and I mean anything.",
  },
  {
    quote:
      "They think I'm homosexual the way I'm chasing the sack. Whippets left me with a drool and a shit-eating grin.",
  },
  {
    quote: "My bitch look like Timothy Chalamet. I'm a product of the gutter.",
  },
  {
    quote:
      "I fried up some corn snake for the kuzos. The zazah got me talking like pingu.",
  },
  {
    quote:
      "I'm the real Goliath grouper. I'm gonna need you to suck the pigmentation out of this one young blood.",
  },
  {
    quote:
      "Shorty ass so fat I thought I was balls deep in Kyle Lowry. I only handed back the free world because I was bored.",
  },
  {
    quote: "This blunt is overwhelmingly large. This blunt has a pulse.",
  },
  {
    quote:
      "This blunt looks like Ray J's dick. This blunt got veins pumping through it.",
  },
  {
    quote:
      "This blunt curved right at the tip. This blunt looks like it's been pushed out.",
  },
  {
    quote:
      "This blunt has a family somewhere worried as hell. I ain't even gonna hide it no more.",
  },
  {
    quote:
      "This blunt feels like a solid fibrous piece of shit. Straight up a big meaty piece of shit.",
  },
  {
    quote:
      "Balanced diets. Lots of fruit and vegetables would honestly float in the water which is a sign of good health.",
  },
  {
    quote: "Husky little fella. The zazah got me connecting the dots.",
  },
  {
    quote:
      "There are bugs under my skin. I need to dig them out with a screwdriver.",
  },
  {
    quote:
      "She broke my heart, had me shadowboxing behind the 7-Eleven in my 2005 Cleveland LeBron jersey, Zara jeans, and some LRG shoes.",
  },
  {
    quote: "Windows tinted listening to T Grizzly smoking on a goon rock.",
  },
  {
    quote: "The bugs are back. I'm smoking on pussy slaw.",
  },
  {
    quote:
      "The worms in my head won't shut the hell up. They're telling me to go absolutely fucking stupid on them.",
  },
  {
    quote:
      "I don't even need to brandish the nine. I'm pissing and drooling all over myself.",
  },
  {
    quote:
      "Howling and itching to take lives. Shit. I'm so excited to take lives.",
  },
  {
    quote:
      "I'm literally covered in cock-a-lishitty boy meaty. I can't even take care of myself when I think about this shit.",
  },
  {
    quote:
      "Smoking a real nuclear shit submarine. I got this shit figured out.",
  },
  {
    quote:
      "Smoked a seven gram backwood of shadow whisperer. Shit had me fucked up in the crib, looking up pictures of dogs with human eyes.",
  },
  {
    quote:
      "I got interdimensional demons dropping the pin as we speak. They'll take anyone back over there.",
  },
  {
    quote:
      "Unholy doses of Percocet and Hennessy got me shit in the bed more than the Oakland A's.",
  },
  {
    quote: "I'm back to back with God shaking the fucking universe.",
  },
  {
    quote:
      "This is an army of two. Feed his ass and send him into an improvement cycle.",
  },
  {
    quote: "He look like Batman Kebo now. This zop feel like heroin.",
  },
  {
    quote:
      "This heroin feel like zop. Flashed it at the parking lot in the Linux mall with a serial number scratched out and everything.",
  },
  {
    quote:
      "Threw the op into the particle collider. Watched his ass get pulled apart into a million pieces.",
  },
  {
    quote:
      "Turned his sorry ass into some data. Stuffed her booty hole with some sour diesel and sent her on her way.",
  },
  {
    quote:
      "That little flesh canoe got a mesquite vibe to it. Perhaps an apple or cherry wood smoke.",
  },
  {
    quote:
      "She took a chance and spread it for a Nebraska dollar. She had a whole speakeasy behind those meat curtains.",
  },
  {
    quote: "The pussy has its own time signature. The bugs are back.",
  },
  {
    quote: "Ring so heavy I can't answer the phone. I don't want to kill them.",
  },
  {
    quote: "Shut up. I don't want to kill anybody. Put the gun down young man.",
  },
  {
    quote:
      "There's too much pussy out there to kill yourself. That pussy tighter than the bulletproof counter window at a White Castle.",
  },
  {
    quote:
      "How can I be gay? My bitch is homophobic. Haha. Shout out to my man Cinch.",
  },
  {
    quote:
      "Rolled in. Wagwan big one up yourself. Select a duddy wine roadside gal.",
  },
  {
    quote: "Me a gone fuck. 58% THC pre-rolled joints. Rolled in keap.",
  },
  {
    quote: "Had me reading the book of revelations. We are indeed close.",
  },
  {
    quote: "I bought her Chanel bags until there was nothing left in her eyes.",
  },
  {
    quote:
      "Motherfuckers live in their car and call it van life. Stop lying to yourself and just say you're homeless you stupid bum.",
  },
  {
    quote:
      "I'm at Magic City moving like the government. I fucked her with my and one shoes on and some dada shorts.",
  },
  {
    quote:
      "Eating Chloe Kardashian's ass like I'm dying and there's a second chance in there.",
  },
  {
    quote: "I'm a high functioning shooter. Yeah I'm big on astrology.",
  },
  {
    quote:
      "I'm always looking at a fat dirt star every chance I get. I'm off a rhino pill ready to get my rocks off.",
  },
  {
    quote:
      "My watch costs 50 bands and I still don't have time for you fuckboys.",
  },
  {
    quote:
      "Pussy clot. The casualties you will suffer trying to fuck with me will have you thinking like Magnus Carlsen.",
  },
  {
    quote:
      "I need to kill. I need to kill. Rome wasn't built in a day but this nine millimeter certainly was.",
  },
  {
    quote:
      "Give me the fucking fentanyl. Just finished on my own stomach. Time for some oxtail.",
  },
  {
    quote: "I ain't gonna lie I'm kind of feeling myself right now gang.",
  },
  {
    quote:
      "We smoking eucalyptus pigeon shit. She was awestruck admiring the girth, the length, the texture, the vein thickness, blood flow, color, circumcision.",
  },
  {
    quote:
      "Gave her a benti a cum with two pumps of dragon nut. All I'm saying is if I paid for the hour I'ma get the full hour.",
  },
  {
    quote:
      "Been fucking so long my cock is sanded out smooth. This chopped cheese is from Red Hook and this clock was 3D printed in Bangladesh.",
  },
  {
    quote:
      "This shit is international. I'm posting it up at the cribbo with three bitches feasting on some Nicaraguan nose nachos while listening to Rich and Mary.",
  },
  {
    quote:
      "I'm a real glutton. Went to old block and nobody ever heard of you slime.",
  },
  {
    quote: "Motherfucker these are not ruru rumin's. These are chrome hearts.",
  },
  {
    quote: "I'm smoking that Rasputin hear ye hear ye durban poison.",
  },
  {
    quote: "DJ Mustard let me in Dijon. Let me in. Mustard on the beat ho.",
  },
  {
    quote:
      "Martif Morris always been my favorite twin. Motherfucker of course I have a pink tip.",
  },
  {
    quote:
      "I come from a low frequency environment and I've only used cash my entire life.",
  },
  {
    quote:
      "The only time I ever held a card was when I borrowed my cousin's bank of America debit card to slice open a funnel cake at the county fair when I took my daughter there on a trip amidst a lengthy child custody battle with my ex-wife attempting to prove to the judge that I'm a responsible father but we all know I'm fucking not.",
  },
  {
    quote:
      "I got the kids ears pierced at two years old and she already knows what Red Bull tastes like.",
  },
  {
    quote:
      "I'm fucked. Judge if you're seeing this please let me have Mackenzie back.",
  },
  {
    quote:
      "I even wore my nice eight ball jean jacket to the last court hearing. I'm ready to change.",
  },
  {
    quote:
      "At short he's spitting my chicken and rice. I've been fully consumed by hatred jealousy and lust.",
  },
  {
    quote:
      "I can't help but get thrown into a violent trance at the slightest hint of criticism or pushback.",
  },
  {
    quote: "Poured up with famous decks started doing the nod walk.",
  },
  {
    quote:
      "Whoa Dexter my impulsive nature causes conflict at any given time like Tae Flock.",
  },
  {
    quote:
      "I had to up it in fashion district shot into the Hermes store and hit eight people.",
  },
  {
    quote:
      "I made sure all the Birkin bags were unarmed so that the hoes don't bug out on me about it later.",
  },
  {
    quote:
      "The zazah got me acting inconsiderate. Give me a mattress and a fleshlight I'll thrive anywhere.",
  },
  {
    quote:
      "I wept for there were no worlds left to conquer. I was at the battle of Jericho taunting both sides with my cock out.",
  },
  {
    quote:
      "Taped the fleshlight to the bottom of my desk and got right into it. I didn't talk to anyone for 52 hours.",
  },
  {
    quote:
      "The 12,000 year old drink them so old it doesn't even smell no more.",
  },
  {
    quote:
      "Smoking zaza like I don't believe in myself. I got to where I am today through violence. I'm thankful for it.",
  },
  {
    quote:
      "They call me Ben Simmons because I don't play at all. Help myself and want fucking nuts on the Fifi.",
  },
  {
    quote: "Don't mind if I do. These white people are crazy. Fuck them.",
  },
  {
    quote:
      "Never let these white people change you. Pistol built like Dave Portnoy.",
  },
  {
    quote: "I have no backbone. I'm loyal to whoever pays the most.",
  },
  {
    quote:
      "My character is so flawed the only time I ever stood 10 toes on anything was on the opp's throat.",
  },
  {
    quote:
      "I was one in nine babies abandoning the bando. My earliest memory is getting breastfed by the pit bull.",
  },
  {
    quote:
      "What? I'm so busy shooting I'm celibate. I'm moving like meat mill.",
  },
  {
    quote: "Where you get them vibrating panties? Is them on Amazon?",
  },
  {
    quote:
      "Shorty's head built like the Warner Brothers logo. Shorty's head built like Damien Lillard.",
  },
  {
    quote:
      "Shorty's head built like an asteroid. Shorty's head built like a bionicle.",
  },
  {
    quote:
      "Shorty's head built like a garlic knot. Shorty head built like a Chevrolet.",
  },
  {
    quote:
      "Shorty head built like Papua New Guinea. Shorty built like a south part character.",
  },
  {
    quote:
      "Y'all are crabs in a bucket. And I got Old Bay seasoning. Maybe even some Zadarans.",
  },
  {
    quote:
      "Bucket. Chewing on the labia for six hours like a steak from Cracker Barrel.",
  },
  {
    quote:
      "Found the homie's beheading video on Daily Motion. That little shit owed me money.",
  },
  {
    quote: "What the fuck dude? Didn't drink any water all day.",
  },
  {
    quote:
      "Tried to nut on her chest but the cum was thick like a loogie. Shit didn't even get any airtime.",
  },
  {
    quote:
      "It slowly dribbled over my fingers and didn't even hit the ground. The chlorine smell was insufferable.",
  },
  {
    quote:
      "So I offset the smell with some crack. Cops wanted to tame me for aggressively hitting the claw machine.",
  },
  {
    quote:
      "I'm trying to explain to him that we are all just atoms so he might as well let me go.",
  },
  {
    quote:
      "Taking the wildest huff of Ben Gae mid climax. Had my eyes rolling back with my tongue hanging out.",
  },
  {
    quote:
      "Howling in ecstasy. Squirming around on a twin-size mattress in an empty section 8 apartment.",
  },
  {
    quote:
      "Let's say if you do what you love you'll never work a day in your life.",
  },
  {
    quote: "Perks put me on the wrong side of history almost every time.",
  },
  {
    quote:
      "I beat my own head in with a rock because I couldn't stand the fact that I'll never get to fucker.",
  },
  {
    quote: "Grab a leaf made everything go black and white.",
  },
  {
    quote:
      "You think I'm standing here eating sauteed bok choy? Because I want to?",
  },
  {
    quote:
      "I'm waiting for the red light district to open you fuckhead. Use your fucking head.",
  },
  {
    quote:
      "Pulled out the Luger. Put his ass in a to-go box. Little rib cage ass motherfucker.",
  },
  {
    quote:
      "I put a hole in that boy. She listens to rock and roll. I smoke rock and roll.",
  },
  {
    quote:
      "Psychologically terrorize the op until he killed himself at the Michael Jordan steakhouse.",
  },
  {
    quote:
      "One thing about me I only fuck with fluorescent lighting. I need to see absolutely everything.",
  },
  {
    quote:
      "Some of you have never heated up a banana peel in the microwave for eight seconds to replicate the warmth of a vagina and it shows.",
  },
  {
    quote: "I come from nothing. I started this shit.",
  },
  {
    quote: "I was in the bando blasting loads onto the wall letting it dry.",
  },
  {
    quote:
      "I was in the sticks using rubber gloves to trick myself into thinking I was being serviced by a nurse.",
  },
  {
    quote:
      "You can't even imagine what the fuck I've been through. I'm psycho.",
  },
  {
    quote:
      "I'll rub my own nut all over the Glock to let them know I really been here.",
  },
  {
    quote:
      "I'm a real shit-flinging beast. If my skull wasn't made out of titanium I'd kill myself.",
  },
  {
    quote:
      "I really want to and I really should but God doesn't give with two hands.",
  },
  {
    quote: "Fuck. We smoke and bow. Cooked her shit into a nice roux.",
  },
  {
    quote:
      "Boy wanted some clout. I put him on the news and turned him into a real superstar.",
  },
  {
    quote:
      "Humans will never understand their true abilities. Why the fuck did we kill up the Neanderthals? Those idiots could have easily worked construction and doubled our profits.",
  },
  {
    quote: "You better bring me that brick. Look at he split.",
  },
  {
    quote:
      "Lil Bro greened out off the cart the other day and thought I was Sammy Sosa.",
  },
  {
    quote:
      "We're getting warmer. The day I go broke will be the day hell freezes over.",
  },
  {
    quote: "How you feel gang? She eating my ass and whatnot.",
  },
  {
    quote: "I'm free-basing etc. and pouring my soul into the game.",
  },
  {
    quote:
      "When everyone gave up on the block I didn't hesitate to start selling my balls, booty and dick.",
  },
  {
    quote:
      "Pussy boys tried to rob me so I tranquilized them and boiled them in duck broth till their bones floated to the surface.",
  },
  {
    quote:
      "Then I added some andouille sausage, garlic powder, onion powder, red pepper flakes, black pepper, tony seasoning and enjoyed me some nice steamy oc gumbo.",
  },
  {
    quote:
      "I'm in Myrtle Beach scraping rust off the fucking frogs losing my goddamn mind.",
  },
  {
    quote: "She's giving me talk and so on and so forth.",
  },
  {
    quote: "Choke bitch ass up before I slap the dog shit out of you.",
  },
  {
    quote:
      "I believe in you. You can accomplish anything you want in this life.",
  },
  {
    quote:
      "I'm a fucking mud slut. That pussy had a plethora of gorilla grip strength.",
  },
  {
    quote: "I can feel the fungi munching on my brain. I'm sick.",
  },
  {
    quote: "Ah the worms. The worms. The worms. The worms. The worms.",
  },
  {
    quote: "I'm in the Mariana Trench smoking submersible.",
  },
  {
    quote:
      "I folded her fat ass up like a futon and climbed into her pussy like a marsupial.",
  },
  {
    quote:
      "I had to put the poppers down because it was really moving the needle.",
  },
  {
    quote:
      "I'm moving the needle. I keep on pumping until the viscosity is just right.",
  },
  {
    quote:
      "My shot doesn't got a switch on it bitch. I'll turn Twitter fingers into Twinkies.",
  },
  {
    quote: "The worms in my head keep talking.",
  },
  {
    quote: "Tiger? Dropped the low on they ass pussy boy.",
  },
  {
    quote: "Thought he had the drop. Then I swiss cheese that motherfucker.",
  },
  {
    quote: "Turned his SRT into a convertible. Put a switch on the Glock.",
  },
  {
    quote: "This motherfucker sounded like a Beyblade. Ah the worms are back.",
  },
  {
    quote: "Ah the worms are back. That perk eating my ass up.",
  },
  {
    quote: "They don't call it a scat pack for no reason.",
  },
  {
    quote:
      "I had a bad bitch in the passenger seat and I pressed the gas and showed her what 485 horsepower feels like. Then she shitted on my seat. I don't give a shit.",
  },
  {
    quote:
      "This za got me shitting like the Henny got me shitting. Shitception.",
  },
  {
    quote: "Uh oh. That Henny about to make me shit.",
  },
  {
    quote:
      "You think I care about this shit? The only time I feel something is when I look.",
  },
  {
    quote: "I want to watch you burn. Ah I remember when I took my first perk.",
  },
  {
    quote: "I got the drum on me. I'm about to make a fucking beat.",
  },
  {
    quote: "I'm moving crazy. I'm a fucking junkie cannibal.",
  },
  {
    quote:
      "All I want to do is sip mud and eat my hops. The worms. Ah the worms are back.",
  },
  {
    quote: "This shit ain't nothing to me man.",
  },
];

const userQuotes = [];

// Select random quote from array
const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotesArray.length);
  return quotesArray[randomIndex].quote;
};

// Define a route handler for GET requests made to the /randomquote endpoint
app.get("/randomquote", (req, res) => {
  res.json(getRandomQuote());
});

// Route 2: Get a quote by index
app.get("/quote/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Validate that the index is within range
  if (id >= 0 && id < quotesArray.length) {
    res.json(quotesArray[id].quote);
  } else {
    res.status(404).json({ error: "Quote not found" });
  }
});

// Route 3: Get the total number of quotes
app.get("/total", (req, res) => {
  res.json(quotesArray.length);
});

// Post request to add new data to the server memory
app.post("/quotes", (req, res) => {
  const newQuote = req.body.quote;
  userQuotes.push(newQuote);

  // Send a success response back to the frontend
  res
    .status(201)
    .json({ message: "Quote added successfully", quote: newQuote });
});

// Route 4: Get new quotes user has added
app.get("/quotes", (req, res) => {
  console.log("Get quotes triggered");
  res.json(userQuotes);
  console.log(`User quotes: ${userQuotes}`);
});

// Start the server and listen for incoming HTTP requests on port 8080
app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

// This is a crucial part of any Express application, as it actually puts the server in a state where it can start handling incoming requests.
