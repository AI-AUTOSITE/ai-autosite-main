# BMI Calculator Tool - Status File v1.0

## 📌 Tool Overview

**Name:** BMI Calculator
**URL:** /tools/bmi-calculator
**Category:** quick-tools
**Target Users:** Everyone (health tracking, fitness goals)
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)

1. **Enter Height** - Feet/inches or cm
2. **Enter Weight** - Pounds or kg
3. **Calculate BMI** - Instant result
4. **Show Category** - Underweight/Normal/Overweight
5. **Health Tips** - General guidance

## 📁 File Structure

app/tools/bmi-calculator/
├── page.tsx # Metadata only
├── components/
│ └── BmiCalculatorClient.tsx # Main component
└── guide.tsx # Help guide

## 🔧 Technical Requirements

- **No server needed** - 100% client-side
- **Unit toggle:** Imperial/Metric
- **Range:** Reasonable human values
- **Formula:** weight(kg) / height(m)²
- **Categories:** WHO standards

## 💭 User Flow (3-Second Rule)

1. **Enter measurements** → Toggle units if needed
2. **Click calculate** → See BMI instantly
3. **View category** → Understand result

## 🎨 UI Design

[BMI Calculator]
[Unit toggle: Imperial | Metric]
[Height: [___] ft [___] in]
[Weight: [___] lbs]
[Calculate button]

Your BMI: 22.5
Status: Normal weight

## 📝 Simple English Copy

Title: "BMI Calculator"
Subtitle: "Check your body mass index"
Labels: "Height" / "Weight"
Button: "Calculate BMI"
Results: "Your BMI is X"
Categories: "Underweight/Normal/Overweight/Obese"

## 🚫 What NOT to Include

- Medical advice
- Diet recommendations
- Calorie counters
- Body fat percentage
- Target weight goals
- Exercise plans

## 📊 Success Metrics

- Calculation: Instant
- Unit switching: Smooth
- Mobile friendly: Yes
- Clear categories: Yes
- No judgment: Neutral tone
