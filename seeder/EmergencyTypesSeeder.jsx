<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmergencyType;

class EmergencyTypesSeeder extends Seeder
{
    public function run()
    {
        $types = [
            // Cardiac
            [
                'category_id' => 'cardiac',
                'name' => 'Heart Attack',
                'slug' => 'heart_attack',
                'icon' => 'Heart',
                'default_severity' => 'critical',
                'common_symptoms' => ['Chest pain', 'Shortness of breath', 'Sweating', 'Nausea', 'Pain in arm/jaw'],
                'required_equipment' => ['defibrillator', 'ecg_monitor', 'oxygen', 'aspirin'],
                'dispatch_instructions' => 'Dispatch ALS ambulance immediately. Notify cardiac center. Bring 12-lead ECG.'
            ],
            [
                'category_id' => 'cardiac',
                'name' => 'Stroke Symptoms',
                'slug' => 'stroke',
                'icon' => 'Brain',
                'default_severity' => 'critical',
                'common_symptoms' => ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden severe headache'],
                'required_equipment' => ['stroke_kit', 'glucometer', 'blood_pressure'],
                'dispatch_instructions' => 'Time-critical: Note exact symptom onset time. Rush to stroke center. Check blood glucose.'
            ],
            // Trauma
            [
                'category_id' => 'trauma',
                'name' => 'Vehicle Accident',
                'slug' => 'vehicle_accident',
                'icon' => 'Car',
                'default_severity' => 'critical',
                'common_symptoms' => ['Multiple injuries', 'Trapped', 'Unconscious', 'Bleeding', 'Spinal injury suspected'],
                'required_equipment' => ['extrication_tools', 'trauma_kit', 'cervical_collar', 'spinal_board'],
                'dispatch_instructions' => 'Multiple units may be needed. Fire department for extrication. Consider air ambulance.'
            ],
            [
                'category_id' => 'trauma',
                'name' => 'Severe Burns',
                'slug' => 'burns',
                'icon' => 'Flame',
                'default_severity' => 'urgent',
                'common_symptoms' => ['Deep burns', 'Large area', 'Face/hands/genitals', 'Chemical exposure', 'Inhalation injury'],
                'required_equipment' => ['burn_kit', 'sterile_water', 'oxygen'],
                'dispatch_instructions' => 'Do not apply ointments. Cool with water if chemical. Check airway for inhalation injury.'
            ],
            // Continue for all types...
        ];

        foreach ($types as $type) {
            EmergencyType::create($type);
        }
    }
}