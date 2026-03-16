import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Brain,
  Bone,
  Flame,
  Wind,
  Car
  
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import api from "../services/api";
import { useAuthStore } from "../stores/authStore";
import MapComponent from "../components/MapComponent";

const EMERGENCY_CATEGORIES = [
{
id: "cardiac",
name: "Cardiac & Respiratory",
icon: Heart,
color: "red",
description: "Heart attacks and breathing emergencies",
emergencies: [
{
id: "heart_attack",
name: "Heart Attack",
icon: Heart,
severity: "critical",
symptoms: ["Chest pain","Shortness of breath","Sweating","Nausea"]
},
{
id: "stroke",
name: "Stroke Symptoms",
icon: Brain,
severity: "critical",
symptoms: ["Face drooping","Arm weakness","Speech difficulty"]
},
{
id: "breathing",
name: "Difficulty Breathing",
icon: Wind,
severity: "critical",
symptoms: ["Wheezing","Blue lips","Gasping"]
}
]
},

{
id: "trauma",
name: "Trauma & Injuries",
icon: Bone,
color: "orange",
description: "Accidents and injuries",
emergencies: [
{
id: "accident",
name: "Vehicle Accident",
icon: Car,
severity: "critical",
symptoms: ["Multiple injuries","Unconscious","Bleeding"]
},
{
id: "fracture",
name: "Broken Bone",
icon: Bone,
severity: "urgent",
symptoms: ["Deformity","Swelling","Severe pain"]
},
{
id: "burns",
name: "Severe Burns",
icon: Flame,
severity: "urgent",
symptoms: ["Deep burns","Large area","Chemical burns"]
}
]
}
];


// ----------------------
// Severity Config
// ----------------------

const SEVERITY_CONFIG = {
critical:{
bg:"bg-red-600",
text:"text-red-600",
label:"CRITICAL",
responseTime:"< 8 min"
},
urgent:{
bg:"bg-orange-500",
text:"text-orange-500",
label:"URGENT",
responseTime:"< 15 min"
},
moderate:{
bg:"bg-yellow-500",
text:"text-yellow-600",
label:"MODERATE",
responseTime:"< 30 min"
}
};



// ========================================================
// MAIN COMPONENT
// ========================================================

export default function EmergencyRequest(){

const navigate = useNavigate();
const { user } = useAuthStore();

const [step,setStep] = useState(1);
const totalSteps = 5;

const [location,setLocation] = useState(null);
const [selectedCategory,setSelectedCategory] = useState(null);
const [selectedEmergency,setSelectedEmergency] = useState(null);

const [symptoms,setSymptoms] = useState([]);
const [description,setDescription] = useState("");


// ----------------------
// Get GPS Location
// ----------------------

useEffect(()=>{

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

(pos)=>{
setLocation({
lat:pos.coords.latitude,
lng:pos.coords.longitude,
accuracy:pos.coords.accuracy
})
},

(err)=>console.log(err),

{enableHighAccuracy:true}

)

}

},[])



// ----------------------
// Submit Emergency
// ----------------------

const emergencyMutation = useMutation({

mutationFn:(data)=>api.post("/emergency/request",data),

onSuccess:(res)=>{

navigate(`/track/${res.data.emergency.id}`)

}

})



const handleSubmit = ()=>{

const emergencyData = {

latitude:location.lat,
longitude:location.lng,

category:selectedCategory.id,
type:selectedEmergency.id,
severity:selectedEmergency.severity,

symptoms,
description,

user_id:user?.id

}

emergencyMutation.mutate(emergencyData)

}



// ----------------------
// UI STEP 1
// ----------------------

const StepLocation = ()=>(
<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="space-y-6"
>

<h2 className="text-2xl font-bold">Confirm Your Location</h2>

{location ? (

<>

<div className="h-64 rounded-xl overflow-hidden">

<MapComponent
center={[location.lng,location.lat]}
zoom={15}
markers={[{lng:location.lng,lat:location.lat}]}
/>

</div>

<button
onClick={()=>setStep(2)}
className="w-full bg-red-600 text-white py-4 rounded-xl"
>
Confirm Location
</button>

</>

):( <p>Getting location...</p> )}

</motion.div>
)



// ----------------------
// UI STEP 2
// ----------------------

const StepCategory = ()=>(
<div>

<h2 className="text-2xl font-bold mb-4">Select Emergency Category</h2>

<div className="grid grid-cols-2 gap-4">

{EMERGENCY_CATEGORIES.map(category=>{

const Icon = category.icon

return(

<button
key={category.id}
onClick={()=>setSelectedCategory(category)}
className="p-4 border rounded-xl"
>

<Icon size={30}/>

<p className="font-bold">{category.name}</p>

</button>

)

})}

</div>

<button
onClick={()=>setStep(3)}
disabled={!selectedCategory}
className="w-full mt-6 bg-red-600 text-white py-4 rounded-xl"
>
Continue
</button>

</div>
)



// ----------------------
// UI STEP 3
// ----------------------

const StepEmergencyType = ()=>{

if(!selectedCategory) return null

return(

<div>

<h2 className="text-xl font-bold mb-4">
{selectedCategory.name}
</h2>

{selectedCategory.emergencies.map(emergency=>{

const Icon = emergency.icon

return(

<button
key={emergency.id}
onClick={()=>setSelectedEmergency(emergency)}
className="w-full p-4 border rounded-xl mb-3 flex items-center gap-3"
>

<Icon size={24}/>

<div>
<p className="font-bold">{emergency.name}</p>
<p className="text-sm text-gray-500">
{emergency.symptoms.join(", ")}
</p>
</div>

</button>

)

})}

<button
onClick={()=>setStep(4)}
disabled={!selectedEmergency}
className="w-full bg-red-600 text-white py-4 rounded-xl mt-4"
>
Continue
</button>

</div>

)

}



// ----------------------
// UI STEP 4
// ----------------------

const StepDetails = ()=>(
<div>

<h2 className="text-xl font-bold mb-4">
Describe Emergency
</h2>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="w-full border rounded-xl p-4"
rows={4}
/>

<button
onClick={()=>setStep(5)}
className="w-full mt-4 bg-red-600 text-white py-4 rounded-xl"
>
Review
</button>

</div>
)



// ----------------------
// UI STEP 5
// ----------------------

const StepReview = ()=>(
<div>

<h2 className="text-xl font-bold mb-4">
Review Request
</h2>

<p><b>Category:</b> {selectedCategory.name}</p>
<p><b>Emergency:</b> {selectedEmergency.name}</p>

<p><b>Description:</b> {description}</p>

<button
onClick={handleSubmit}
className="w-full bg-red-600 text-white py-4 rounded-xl mt-4"
>

{emergencyMutation.isLoading
? "Dispatching..."
: "Request Ambulance"}

</button>

</div>
)



// ----------------------
// MAIN RETURN
// ----------------------

return(

<div className="max-w-2xl mx-auto p-4">

<AnimatePresence mode="wait">

{step===1 && <StepLocation/>}
{step===2 && <StepCategory/>}
{step===3 && <StepEmergencyType/>}
{step===4 && <StepDetails/>}
{step===5 && <StepReview/>}

</AnimatePresence>

</div>

)

}