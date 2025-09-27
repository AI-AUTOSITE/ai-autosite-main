# Age Calculator Tool - Status File v1.0

## 📌 Tool Overview
**Name:** Age Calculator
**URL:** /tools/age-calculator
**Category:** quick-tools
**Target Users:** Everyone (birthdays, anniversaries, milestones)
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)
1. **Pick Birthday** - Date selector
2. **Show Age** - Years, months, days
3. **Next Birthday** - Days until
4. **Total Days** - Days lived
5. **Fun Facts** - Milestones reached

## 📁 File Structure
app/tools/age-calculator/
├── page.tsx                    # Metadata only
├── components/
│   └── AgeCalculatorClient.tsx # Main component
└── guide.tsx                   # Help guide

## 🔧 Technical Requirements
- **No server needed** - 100% client-side
- **Date handling:** Native JS Date
- **Max range:** 1900 - current year
- **Auto calculate:** On date change
- **Mobile friendly:** Date picker works

## 💭 User Flow (3-Second Rule)
1. **Pick date** → See age instantly
2. **View details** → Days, months, years
3. **Check milestone** → Fun facts

## 🎨 UI Design
[Age Calculator]
[Birthday picker: [____]]
[Calculate button]

[Your Age]
25 years, 3 months, 10 days

[Fun Facts]
- 9,227 days old
- Next birthday in 265 days
- Born on Tuesday

## 📝 Simple English Copy
Title: "Age Calculator"
Subtitle: "How old are you?"
Label: "Your Birthday"
Button: "Calculate"
Results: "You are X years old"
Next: "Next birthday in X days"

## 🚫 What NOT to Include
- Future dates
- Complex time zones
- Historical events
- Zodiac signs
- Life expectancy
- Age comparisons

## 📊 Success Metrics
- Calculation: Instant
- Mobile date picker: Works
- Accuracy: 100%
- Fun facts: Engaging
- Share-worthy: Yes