"""# AI Prioritization Framework - Technical Overview

## Framework Structure

The framework uses a multi-step assessment process to evaluate AI use cases across two primary dimensions:
- Impact Score (0-10)
- Effort Score (0-10)

## Question Categories

The assessment is divided into four strategic sections:

1. Basic Information
   - Name and description of the use case
   - Used for identification and documentation

2. Business Impact Assessment
   - Task frequency
   - Employee coverage
   - Time consumption
   - AI improvement potential
   - Competitive advantage
   - Existing AI tools evaluation

3. Technical Requirements
   - Input set characteristics
   - Response time requirements
   - Performance needs
   - Data source complexity
   - AI interaction model

4. Implementation Considerations
   - Self-operation capability
   - Implementation approach
   - Data sensitivity
   - Scalability requirements
   - Implementation timeline
   - ROI timeframe

## Scoring Algorithm

### Impact Score Calculation

The impact score is calculated using 8 key factors:

```typescript
const impactFactors = [
  aiImprovement,          // How much AI improves output
  competitiveAdvantage,   // Market differentiation
  employeePercentage,     // % of employees affected
  taskFrequency,          // How often task occurs
  roi,                    // Return on investment timeline
  finiteInputs,          // Input set predictability
  asyncResponses,         // Response time flexibility
  performanceNeeds        // Performance requirements
]
```

### Effort Score Calculation

The effort score considers 7 implementation factors:

```typescript
const effortFactors = [
  timeConsuming,          // Task complexity
  dataSources,            // Number of data integrations
  dataSensitivity,        // Security requirements
  implementationTime,     // Development timeline
  scalability,            // Scale requirements
  selfOperation,          // Operational independence
  implementationType      // Technical approach
]
```

## Scoring Logic

### Special Scoring Rules

1. Binary Questions (Yes/No):
   - finiteInputs: Yes = 3, No = 5
   - asyncResponses: Yes = 2, No = 4
   - performanceNeeds: Yes = 5, No = 2
   - selfOperation: Yes = 4, No = 2

2. Implementation Type Scoring:
   ```typescript
   const scores = {
     'Precompute responses': 2,
     'Trigger workflow': 3,
     'Deploy simple service': 3,
     'Deploy advanced stack': 5,
     'Use managed service': 2
   }
   ```

3. Standard Questions:
   - Scored based on option position (0-4)
   - Scaled to fit 1-10 range
   - "Not relevant" responses = 0

### Final Score Calculation

1. Each factor group is averaged
2. Results are scaled (x2.5) to fit 1-10 range
3. Scores are clamped between 1-10

## Quadrant Placement

Use cases are placed in quadrants based on their scores:

1. Quick Wins (High Impact, Low Effort)
   - Impact ≥ 5, Effort < 5
   - Color: Green (#16a34a)

2. Strategic Ventures (High Impact, High Effort)
   - Impact ≥ 5, Effort ≥ 5
   - Color: Blue (#2563eb)

3. Foundation Labs (Low Impact, Low Effort)
   - Impact < 5, Effort < 5
   - Color: Yellow (#ca8a04)

4. Optimization Zone (Low Impact, High Effort)
   - Impact < 5, Effort ≥ 5
   - Color: Red (#dc2626)

## Priority Score

A weighted combination of impact and effort:
```typescript
priorityScore = (impact * 0.7) + ((10 - effort) * 0.3)
```

This formula:
- Weighs impact more heavily (70%)
- Inverts effort so lower effort = higher score
- Produces a final score between 1-10
""" 