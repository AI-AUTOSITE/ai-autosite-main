// app/tools/ai-dev-dictionary/lib/terms/forms-input.ts

import { TechTerm } from './types'

export const formsInputTerms: TechTerm[] = [
  {
    id: 'checkbox',
    term: 'Checkbox',
    category: 'forms',
    aiSynonyms: [
      'Check Box',
      'Tick Box',
      'Selection Box',
      'Check Mark',
      'Toggle Box',
      'Multi-select',
    ],
    description: 'A small box that can be checked or unchecked, allowing multiple selections',
    beginnerTip: 'Like a checklist where you can select multiple items - tick as many as you want!',
    aiPhrases: [
      'Add checkboxes for multiple selection',
      'Create tick boxes for options',
      'Let users check multiple items',
      'Add selection boxes',
      'Implement multi-select with checkboxes',
      'Use checkmarks for preferences',
    ],
    codeExample: `// React Checkbox Example - Check It!
const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}`,
    demoType: 'checkbox',
    relatedTerms: ['Radio Button', 'Switch', 'Toggle'],
  },

  {
    id: 'radio',
    term: 'Radio Button',
    category: 'forms',
    aiSynonyms: [
      'Radio',
      'Option Button',
      'Radio Select',
      'Single Select',
      'Choice Button',
      'Radio Input',
    ],
    description: 'Circular buttons where only one option can be selected from a group',
    beginnerTip: 'Like old car radios - you can only listen to one station at a time!',
    aiPhrases: [
      'Add radio buttons for single selection',
      'Create option buttons',
      'Use radio inputs for choices',
      'Implement single-select options',
      'Add radio group for selection',
      'Make mutually exclusive choices',
    ],
    codeExample: `// React Radio Button Example - Pick One!
const RadioGroup = ({ options, selected, onChange }) => {
  return (
    <div>
      {options.map(option => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={selected === option}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}`,
    demoType: 'radio',
    relatedTerms: ['Checkbox', 'Select', 'Dropdown'],
  },

  {
    id: 'switch',
    term: 'Switch',
    category: 'forms',
    aiSynonyms: [
      'Toggle',
      'Toggle Switch',
      'On/Off Switch',
      'Toggle Button',
      'Binary Switch',
      'Flip Switch',
    ],
    description: 'A sliding button that toggles between on and off states',
    beginnerTip: 'Like a light switch - flip it on or off. Perfect for settings!',
    aiPhrases: [
      'Add a toggle switch for settings',
      'Create an on/off switch',
      'Implement toggle button',
      'Use switch for enabling features',
      'Add toggle for preferences',
      'Make a flip switch control',
    ],
    codeExample: `// React Switch Example - Flip It!
const Switch = ({ isOn, onToggle }) => {
  return (
    <button
      className={\`switch \${isOn ? 'on' : 'off'}\`}
      onClick={onToggle}
    >
      <span className="switch-slider" />
    </button>
  );
}`,
    demoType: 'switch',
    relatedTerms: ['Checkbox', 'Toggle', 'Button'],
  },

  {
    id: 'input',
    term: 'Input Field',
    category: 'forms',
    aiSynonyms: ['Text Field', 'Text Input', 'Input Box', 'Text Box', 'Form Field', 'Entry Field'],
    description: 'A box where users can type text, like their name or email',
    beginnerTip: 'The basic typing box - where users enter information like username or password!',
    aiPhrases: [
      'Add an input field for the name',
      'Create a text box for email',
      'Add text input for user data',
      'Make an entry field',
      'Implement form fields',
      'Add input boxes for information',
    ],
    codeExample: `// React Input Example - Type Away!
const Input = ({ label, value, onChange }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type here..."
      />
    </div>
  );
}`,
    demoType: 'input',
    relatedTerms: ['Textarea', 'Select', 'Form'],
  },

  {
    id: 'select',
    term: 'Select Box',
    category: 'forms',
    aiSynonyms: [
      'Dropdown Select',
      'Select Menu',
      'Option Select',
      'Choice Box',
      'Picker',
      'Select Input',
    ],
    description: 'A dropdown list where users can choose one option from many',
    beginnerTip: 'Like picking your country from a list - click and choose from the options!',
    aiPhrases: [
      'Add a select box for countries',
      'Create dropdown select menu',
      'Implement option selector',
      'Make a choice picker',
      'Add select input for categories',
      'Use dropdown for selection',
    ],
    codeExample: `// React Select Example - Pick From List!
const Select = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Choose...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}`,
    demoType: 'select',
    relatedTerms: ['Dropdown', 'Radio Button', 'Input'],
  },

  {
    id: 'datepicker',
    term: 'Date Picker',
    category: 'forms',
    aiSynonyms: [
      'Calendar Input',
      'Date Selector',
      'Date Input',
      'Calendar Picker',
      'Date Field',
      'Date Chooser',
    ],
    description: 'A calendar interface for selecting dates',
    beginnerTip: 'A mini calendar that pops up to let you pick a date - like booking a flight!',
    aiPhrases: [
      'Add a date picker for birthdate',
      'Create calendar input',
      'Implement date selector',
      'Add calendar for date selection',
      'Make a date chooser',
      'Use date field with calendar',
    ],
    codeExample: `// React Date Picker Example - Pick a Date!
const DatePicker = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="date-picker"
    />
  );
}`,
    demoType: 'datepicker',
    relatedTerms: ['Time Picker', 'Calendar', 'Input'],
  },

  {
    id: 'floating-label',
    term: 'Floating Label',
    category: 'forms',
    aiSynonyms: [
      'Animated Label',
      'Material Label',
      'Moving Label',
      'Dynamic Label',
      'Placeholder Label',
    ],
    description: 'Input label that moves above the field when focused or filled',
    beginnerTip: 'The label starts inside the input box, then "floats" up when you start typing!',
    aiPhrases: [
      'Add floating labels to inputs',
      'Create animated form labels',
      'Implement material design labels',
      'Make moving placeholders',
      'Build dynamic input labels',
      'Add animated field labels',
    ],
    codeExample: `// React Floating Label Example
import { useState } from 'react';

const FloatingLabel = ({ label, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="floating-label-container">
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <label className={focused || value ? 'float' : ''}>
        {label}
      </label>
    </div>
  );
}`,
    demoType: 'floating-label',
    relatedTerms: ['Input Field', 'Form', 'Label'],
  },

  {
    id: 'form-validation',
    term: 'Form Validation',
    category: 'forms',
    aiSynonyms: [
      'Input Validation',
      'Field Validation',
      'Form Checking',
      'Input Verification',
      'Data Validation',
      'Form Errors',
    ],
    description: 'Checking user input for errors and showing helpful messages',
    beginnerTip:
      'Red error messages that appear when you fill out a form incorrectly - like "Please enter a valid email"!',
    aiPhrases: [
      'Add form validation',
      'Validate user input',
      'Show validation errors',
      'Implement field checking',
      'Create input verification',
      'Add error messages to form',
    ],
    codeExample: `// React Form Validation Example
import { useState } from 'react';

const ValidatedInput = ({ value, onChange, type }) => {
  const [error, setError] = useState('');
  
  const validate = (val) => {
    if (type === 'email' && !val.includes('@')) {
      setError('Please enter a valid email');
    } else {
      setError('');
    }
  };
  
  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          validate(e.target.value);
        }}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}`,
    demoType: 'form-validation',
    relatedTerms: ['Form', 'Input', 'Error Message'],
  },

  {
    id: 'autocomplete',
    term: 'Autocomplete',
    category: 'forms',
    aiSynonyms: [
      'Auto-suggest',
      'Type-ahead',
      'Search Suggestions',
      'Predictive Text',
      'Auto-fill',
      'Smart Search',
    ],
    description: 'Suggests options as the user types, like Google search',
    beginnerTip:
      'Start typing and see suggestions appear - like when Google finishes your search for you!',
    aiPhrases: [
      'Add autocomplete to search',
      'Implement type-ahead suggestions',
      'Create auto-suggest input',
      'Build predictive text field',
      'Add search suggestions',
      'Make smart search box',
    ],
    codeExample: `// React Autocomplete Example
import { useState } from 'react';

const Autocomplete = ({ options }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const handleChange = (value) => {
    setQuery(value);
    const filtered = options.filter(opt => 
      opt.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map(s => (
            <li key={s} onClick={() => setQuery(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    demoType: 'autocomplete',
    relatedTerms: ['Search', 'Input', 'Suggestions'],
  },

  {
    id: 'multi-step-form',
    term: 'Multi-step Form',
    category: 'forms',
    aiSynonyms: [
      'Wizard Form',
      'Step-by-step Form',
      'Progressive Form',
      'Staged Form',
      'Sequential Form',
      'Form Wizard',
    ],
    description: 'Form divided into multiple steps or pages',
    beginnerTip:
      'Like online checkout - shipping info → payment → review → complete. One step at a time!',
    aiPhrases: [
      'Create multi-step form',
      'Build wizard interface',
      'Add step-by-step form',
      'Implement progressive form',
      'Make staged data collection',
      'Design form wizard',
    ],
    codeExample: `// React Multi-step Form Example
import { useState } from 'react';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  return (
    <div>
      <div className="progress">
        Step {step} of 3
      </div>
      
      {step === 1 && <PersonalInfo onNext={nextStep} />}
      {step === 2 && <AddressInfo onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <Review onSubmit={handleSubmit} onBack={prevStep} />}
    </div>
  );
}`,
    demoType: 'multi-step-form',
    relatedTerms: ['Stepper', 'Form', 'Wizard'],
  },

  {
    id: 'tag-input',
    term: 'Tag Input',
    category: 'forms',
    aiSynonyms: [
      'Tags Field',
      'Multi-tag Input',
      'Keyword Input',
      'Label Input',
      'Tag Editor',
      'Tag Selector',
    ],
    description: 'Input field for adding multiple tags or keywords',
    beginnerTip: 'Type a word, press Enter, and it becomes a tag. Add multiple tags like hashtags!',
    aiPhrases: [
      'Add tag input field',
      'Create multi-tag selector',
      'Implement keyword input',
      'Build tag editor',
      'Make label input field',
      'Add hashtag input',
    ],
    codeExample: `// React Tag Input Example
import { useState } from 'react';

const TagInput = () => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  
  const addTag = (e) => {
    if (e.key === 'Enter' && input) {
      setTags([...tags, input]);
      setInput('');
    }
  };
  
  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  return (
    <div>
      <div className="tags">
        {tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
            <button onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder="Add a tag..."
      />
    </div>
  );
}`,
    demoType: 'tag-input',
    relatedTerms: ['Input', 'Tags', 'Chip'],
  },

  {
    id: 'range-slider',
    term: 'Range Slider',
    category: 'forms',
    aiSynonyms: [
      'Slider Input',
      'Range Input',
      'Value Slider',
      'Number Slider',
      'Min-Max Slider',
      'Dual Slider',
    ],
    description: 'Slider for selecting a value or range between minimum and maximum',
    beginnerTip:
      'Drag the handle to pick a number - like adjusting volume or brightness on your phone!',
    aiPhrases: [
      'Add range slider for price',
      'Create value slider',
      'Implement number range selector',
      'Build min-max slider',
      'Add dual handle slider',
      'Make adjustable range input',
    ],
    codeExample: `// React Range Slider Example
const RangeSlider = ({ min, max, value, onChange }) => {
  return (
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="slider"
      />
      <div className="value">{value}</div>
    </div>
  );
}`,
    demoType: 'range-slider',
    relatedTerms: ['Input', 'Slider', 'Number Input'],
  },
]
