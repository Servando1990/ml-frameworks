'use client';

import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: string[];
  required?: boolean;
}

interface UseCaseFormProps {
  onSubmit: (useCase: UseCase) => void;
  onCancel: () => void;
  initialUseCase?: UseCase | null;
}

interface UseCase {
  name: string;
  description: string;
  impact: number;
  effort: number;
  answers?: Record<string, string>;
}

// Add a new type for implementation types
interface ImplementationType {
  name: string;
  description: string;
  score: number;
}

// Implementation types from Outerbounds article
const IMPLEMENTATION_TYPES: ImplementationType[] = [
  {
    name: 'Precompute responses',
    description: 'Best when you have a finite set of all inputs. Precompute results and store them in a cache.',
    score: 2
  },
  {
    name: 'Trigger workflow',
    description: 'For cases when inputs aren\'t known in advance but asynchronous responses (in minutes) are acceptable.',
    score: 3
  },
  {
    name: 'Deploy simple service',
    description: 'For real-time responses with self-operation, without high scale/latency requirements.',
    score: 3
  },
  {
    name: 'Deploy advanced stack',
    description: 'For complex real-time serving with high scale or low latency requirements, requiring significant engineering.',
    score: 5
  },
  {
    name: 'Use managed service',
    description: 'When you need real-time responses but don\'t want to operate services yourself.',
    score: 2
  }
];

const PREDEFINED_QUESTIONS: Question[] = [
  {
    id: 'taskFrequency',
    text: 'How often is this task performed?',
    options: ['Not relevant', 'Rarely (monthly or less)', 'Occasionally (weekly)', 'Frequently (daily)', 'Continuously (multiple times per day)'],
    required: true
  },
  {
    id: 'employeePercentage',
    text: 'What percentage of employees perform this task?',
    options: ['Not relevant', 'Less than 10%', '10-30%', '31-60%', 'More than 60%'],
    required: true
  },
  {
    id: 'timeConsuming',
    text: 'On average, how time-consuming is this task?',
    options: ['Not relevant', 'Quick (< 15 minutes)', 'Moderate (15-60 minutes)', 'Lengthy (1-4 hours)', 'Very time-intensive (> 4 hours)'],
    required: true
  },
  {
    id: 'aiImprovement',
    text: 'How much would AI improve the quality of the task output?',
    options: ['Not relevant', 'Minimal improvement', 'Moderate improvement', 'Significant improvement', 'Transformative improvement'],
    required: true
  },
  {
    id: 'competitiveAdvantage',
    text: 'How much would this AI implementation enhance our competitive advantage?',
    options: ['Not relevant', 'Minimal impact', 'Some differentiation', 'Clear competitive advantage', 'Industry-leading innovation'],
    required: true
  },
  {
    id: 'existingAiTools',
    text: 'Have existing AI tools been tried for this task?',
    options: ['Not relevant', 'Not yet attempted', 'Attempted with poor results', 'Attempted with moderate success', 'Successfully implemented']
  },
  {
    id: 'dataSources',
    text: 'How many data sources does this task typically involve?',
    options: ['Not relevant', 'Single source', '2-3 sources', '4-6 sources', '7+ sources']
  },
  {
    id: 'aiInteraction',
    text: 'What\'s the ideal way to interact with the AI for this task?',
    options: ['Not relevant', 'Simple chat interface', 'Integrated web/mobile app', 'API for system integration', 'Customer-facing AI solution']
  },
  {
    id: 'dataSensitivity',
    text: 'How sensitive is the data involved in this task?',
    options: ['Not relevant', 'Public data', 'Internal, non-sensitive data', 'Confidential business data', 'Highly sensitive or regulated data']
  },
  {
    id: 'implementationTime',
    text: 'Estimated time to implement and deploy the AI solution:',
    options: ['Not relevant', 'Quick win (< 1 month)', 'Short-term (1-3 months)', 'Medium-term (3-6 months)', 'Long-term (6+ months)']
  },
  {
    id: 'roi',
    text: 'Expected return on investment (ROI) timeframe:',
    options: ['Not relevant', 'Immediate (< 3 months)', 'Short-term (3-6 months)', 'Medium-term (6-12 months)', 'Long-term (> 12 months)']
  },
  {
    id: 'finiteInputs',
    text: 'Is there a finite enough set of inputs known in advance?',
    options: ['Not relevant', 'No', 'Yes'],
    required: true
  },
  {
    id: 'asyncResponses',
    text: 'Is it ok to return responses asynchronously in minutes?',
    options: ['Not relevant', 'No', 'Yes'],
    required: true
  },
  {
    id: 'selfOperation',
    text: 'Are you comfortable operating services by yourself?',
    options: ['Not relevant', 'No', 'Yes'],
    required: true
  },
  {
    id: 'performanceNeeds',
    text: 'Do you require large scale or low latency?',
    options: ['Not relevant', 'No', 'Yes'],
    required: true
  },
  {
    id: 'modelComplexity',
    text: 'What is the complexity level of the model needed?',
    options: ['Not relevant', 'Simple (e.g., regression, classification)', 'Moderate (e.g., boosted trees, neural networks)', 'Complex (e.g., LLMs, computer vision)'],
    required: true
  }
];

interface Step {
  title: string;
  fields?: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
  }[];
  questions?: Question[];
}

// Function to determine the recommended implementation type based on answers
const determineImplementationType = (answers: Record<string, string> = {}): ImplementationType => {
  if (answers.finiteInputs === 'Yes') {
    return IMPLEMENTATION_TYPES[0]; // Precompute responses
  } else if (answers.asyncResponses === 'Yes') {
    return IMPLEMENTATION_TYPES[1]; // Trigger workflow
  } else if (answers.selfOperation === 'No') {
    return IMPLEMENTATION_TYPES[4]; // Use managed service
  } else if (answers.performanceNeeds === 'Yes') {
    return IMPLEMENTATION_TYPES[3]; // Deploy advanced stack
  } else {
    return IMPLEMENTATION_TYPES[2]; // Deploy simple service
  }
};

export function UseCaseForm({ onSubmit, onCancel, initialUseCase }: UseCaseFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UseCase>>({
    name: initialUseCase?.name || '',
    description: initialUseCase?.description || '',
    impact: initialUseCase?.impact,
    effort: initialUseCase?.effort,
    answers: initialUseCase?.answers || {}
  });

  // Calculate the recommended implementation type
  const recommendedImplementation = determineImplementationType(formData.answers);

  const steps: Step[] = [
    {
      title: 'Basic Information',
      fields: [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          placeholder: 'Give your use case a clear name'
        },
        {
          id: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Briefly describe the use case'
        }
      ]
    },
    {
      title: 'Business Impact Assessment',
      questions: PREDEFINED_QUESTIONS.slice(0, 6)
    },
    {
      title: 'Deployment Requirements',
      questions: [
        PREDEFINED_QUESTIONS.find(q => q.id === 'finiteInputs'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'asyncResponses'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'selfOperation'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'performanceNeeds'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'modelComplexity')
      ].filter((q): q is Question => q !== undefined)
    },
    {
      title: 'Implementation Considerations',
      questions: [
        PREDEFINED_QUESTIONS.find(q => q.id === 'dataSources'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'aiInteraction'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'dataSensitivity'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'implementationTime'),
        PREDEFINED_QUESTIONS.find(q => q.id === 'roi')
      ].filter((q): q is Question => q !== undefined)
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    /**
     * CALCULATION METHOD DOCUMENTATION
     * 
     * The AI Prioritization Framework uses a weighted scoring system to calculate 
     * priority scores for each use case based on impact and effort.
     * 
     * OVERALL FORMULA:
     * Priority Score = (Impact × 0.7) + ((10 - Effort) × 0.3)
     * 
     * IMPACT CALCULATION (70% weight):
     * Impact is calculated from the following factors:
     * 1. AI Improvement: How much AI would improve task quality
     * 2. Competitive Advantage: Business differentiation potential
     * 3. Employee Percentage: What % of employees perform this task
     * 4. Task Frequency: How often the task is performed
     * 5. ROI Timeframe: Expected return on investment period
     * 6. Finite Inputs: Whether there's a finite set of inputs
     * 7. Async Responses: Whether async responses are acceptable
     * 8. Performance Needs: Large scale or low latency requirements
     * 
     * EFFORT CALCULATION (30% weight, inverted):
     * Effort is calculated from the following factors:
     * 1. Time Consuming: How time-intensive the task is
     * 2. Data Sources: Number of data sources involved
     * 3. Data Sensitivity: Level of data sensitivity/regulation
     * 4. Implementation Time: Estimated time to implement
     * 5. Self Operation: Comfort with self-operating services
     * 6. Model Complexity: Level of complexity of the model needed
     * 7. Implementation Type: Recommended deployment approach (auto-determined)
     * 
     * SCORING METHODOLOGY:
     * - Most questions are scored on a 0-4 scale based on option position
     * - Special questions have custom scoring (e.g., Yes/No questions)
     * - Scores are averaged and scaled to a 1-10 range
     * - Final priority score is weighted: 70% impact, 30% inverted effort
     * 
     * QUADRANT PLACEMENT:
     * - Quick Wins: High Impact (≥5), Low Effort (<5)
     * - Strategic Ventures: High Impact (≥5), High Effort (≥5)
     * - Foundation Labs: Low Impact (<5), Low Effort (<5)
     * - Optimization Zone: Low Impact (<5), High Effort (≥5)
     */

    // If we're editing an existing use case and have impact and effort values, use those
    if (initialUseCase?.impact && initialUseCase?.effort) {
      onSubmit({
        name: formData.name as string,
        description: formData.description as string,
        impact: initialUseCase.impact,
        effort: initialUseCase.effort,
        answers: formData.answers as Record<string, string>
      });
      return;
    }

    // Calculate impact score based on relevant questions (0-10 scale)
    const impactFactors = [
      formData.answers?.aiImprovement,
      formData.answers?.competitiveAdvantage,
      formData.answers?.employeePercentage,
      formData.answers?.taskFrequency,
      formData.answers?.roi,
      formData.answers?.finiteInputs,
      formData.answers?.asyncResponses,
      formData.answers?.performanceNeeds
    ];
    
    // Calculate effort score based on relevant questions (0-10 scale)
    const effortFactors = [
      formData.answers?.timeConsuming,
      formData.answers?.dataSources,
      formData.answers?.dataSensitivity,
      formData.answers?.implementationTime,
      formData.answers?.selfOperation,
      formData.answers?.modelComplexity
    ];

    // Add implementation type score to effort factors
    const implementationTypeScore = recommendedImplementation.score;

    // Calculate average scores and scale to 1-10
    const impact = Math.round(
      impactFactors.reduce((sum, factor, index) => 
        sum + getNumericScore(factor, ['aiImprovement', 'competitiveAdvantage', 'employeePercentage', 
        'taskFrequency', 'roi', 'finiteInputs', 'asyncResponses', 'performanceNeeds'][index]), 0) / 
      impactFactors.length * 2.5
    );

    // Include implementation type score in effort calculation
    const effortSum = effortFactors.reduce((sum, factor, index) => 
      sum + getNumericScore(factor, ['timeConsuming', 'dataSources', 'dataSensitivity', 
      'implementationTime', 'selfOperation', 'modelComplexity'][index]), 0);
    
    const effort = Math.round(
      (effortSum + implementationTypeScore) / (effortFactors.length + 1) * 2.5
    );
    
    onSubmit({
      name: formData.name as string,
      description: formData.description as string,
      impact: Math.max(1, Math.min(10, impact)), // Ensure score is between 1-10
      effort: Math.max(1, Math.min(10, effort)), // Ensure score is between 1-10
      answers: {
        ...formData.answers as Record<string, string>,
        // Store the auto-selected implementation type
        implementationType: recommendedImplementation.name
      }
    });
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return formData.name && formData.description;
    }
    
    const currentQuestions = steps[currentStep].questions || [];
    const requiredQuestions = currentQuestions.filter(q => q.required);
    
    return requiredQuestions.every(q => formData.answers?.[q.id]);
  };

  const getNumericScore = (answer: string | undefined, questionId: string) => {
    if (!answer || answer === 'Not relevant') return 0;
    
    // Special scoring for new questions
    if (questionId === 'finiteInputs') {
      return answer === 'Yes' ? 3 : 5;
    }
    if (questionId === 'asyncResponses') {
      return answer === 'Yes' ? 2 : 4;
    }
    if (questionId === 'performanceNeeds') {
      return answer === 'Yes' ? 5 : 2;
    }
    if (questionId === 'selfOperation') {
      return answer === 'Yes' ? 4 : 2;
    }
    if (questionId === 'modelComplexity') {
      const scores: Record<string, number> = {
        'Simple (e.g., regression, classification)': 2,
        'Moderate (e.g., boosted trees, neural networks)': 3,
        'Complex (e.g., LLMs, computer vision)': 5
      };
      return scores[answer] || 0;
    }

    // Default scoring for original questions
    const options = PREDEFINED_QUESTIONS.find(q => q.options.includes(answer))?.options || [];
    const index = options.indexOf(answer);
    return index > 0 ? index : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
        <button onClick={onCancel} className="text-[#F4F5F8]/60 hover:text-[#F4F5F8]">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {currentStep === 0 ? (
          steps[0].fields?.map(field => (
            <div key={field.id}>
              <label className="block text-sm mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.id as keyof typeof formData] as string}
                  onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#F4F5F8]/5 border border-[#F4F5F8]/20 focus:border-[#F4F5F8]/40 focus:outline-none"
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.id as keyof typeof formData] as string}
                  onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#F4F5F8]/5 border border-[#F4F5F8]/20 focus:border-[#F4F5F8]/40 focus:outline-none"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))
        ) : (
          <div className="space-y-4">
            {/* Display helpful context for deployment requirements */}
            {currentStep === 2 && (
              <div className="p-3 bg-[#F4F5F8]/5 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-1">About Deployment Approaches</h4>
                <p className="text-[#F4F5F8]/80 text-sm mb-2">
                  The following questions help determine the most appropriate deployment approach for your AI model based on the Outerbounds best practices.
                </p>
                <p className="text-[#F4F5F8]/80 text-sm">
                  Your answers will guide the system to recommend one of these deployment options: precomputing responses, triggering a workflow, deploying a simple service, deploying an advanced stack, or using a managed service.
                </p>
              </div>
            )}

            {/* Display implementation recommendation in the Implementation Considerations step */}
            {currentStep === 3 && (
              <div className="p-3 bg-[#F4F5F8]/5 rounded-lg mb-4">
                <h4 className="text-sm font-medium mb-1">Recommended Implementation Approach:</h4>
                <div className="text-[#F4F5F8]/80 text-sm">
                  <p className="font-medium">{recommendedImplementation.name}</p>
                  <p className="mt-1">{recommendedImplementation.description}</p>
                </div>
              </div>
            )}

            {steps[currentStep].questions?.map(question => (
              <div key={question.id}>
                <label className="block text-sm mb-1">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {/* Add descriptive text for key deployment questions */}
                {question.id === 'finiteInputs' && (
                  <p className="text-xs text-[#F4F5F8]/60 mb-1">If inputs can be precomputed, like personalized recommendations based on historical data.</p>
                )}
                {question.id === 'asyncResponses' && (
                  <p className="text-xs text-[#F4F5F8]/60 mb-1">If users can wait minutes for results rather than needing immediate responses.</p>
                )}
                {question.id === 'selfOperation' && (
                  <p className="text-xs text-[#F4F5F8]/60 mb-1">Whether you prefer operating services yourself or using managed solutions.</p>
                )}
                {question.id === 'performanceNeeds' && (
                  <p className="text-xs text-[#F4F5F8]/60 mb-1">If your application requires high throughput (many requests/second) or very low latency.</p>
                )}
                <select
                  value={formData.answers?.[question.id] || ''}
                  onChange={e => setFormData({
                    ...formData,
                    answers: { ...formData.answers, [question.id]: e.target.value }
                  })}
                  className="w-full p-2 rounded-lg bg-[#F4F5F8]/5 border border-[#F4F5F8]/20 focus:border-[#F4F5F8]/40 focus:outline-none"
                >
                  <option value="">Select an option</option>
                  {question.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          className={`px-4 py-1.5 rounded-lg text-sm ${
            currentStep === 0 ? 'invisible' : 'text-[#F4F5F8]/60 hover:text-[#F4F5F8]'
          }`}
        >
          Previous
        </button>
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-[#F4F5F8]' : 'bg-[#F4F5F8]/20'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`px-4 py-1.5 rounded-lg text-sm ${
            isStepValid()
              ? 'bg-[#F4F5F8]/10 hover:bg-[#F4F5F8]/20'
              : 'bg-[#F4F5F8]/5 text-[#F4F5F8]/40 cursor-not-allowed'
          }`}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
} 