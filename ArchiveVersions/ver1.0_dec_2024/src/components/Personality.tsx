import { PersonalityTrait } from '../types'

const personalityTraits: PersonalityTrait[] = [
  {
    icon: '💡',
    title: 'INTP Personality Traits',
    description:
      'Both outgoing and reserved (slightly more reserved), cautious, and focused on excellence according to the DISC Assessment.',
  },
  {
    icon: '🧠',
    title: 'Thirst for Knowledge',
    description: 'Exhibits curiosity, patience, and a keenness to learn.',
  },
  {
    icon: '🔧',
    title: 'Problem-Solving Approach',
    description:
      'Maintains an open mind, actively questions, excels in problem-solving, and is collaborative, supportive, yet dominant.',
  },
  {
    icon: '🤔',
    title: 'Critical Thinking',
    description:
      'Demonstrates a blend of flexibility and adaptability, paired with critical thinking that is objective.',
  },
]

export default function Personality() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
        Personalities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {personalityTraits.map((trait, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-lg shadow-lg hover-bright flex items-start space-x-4"
          >
            <span className="text-indigo-400 text-3xl">{trait.icon}</span>
            <div>
              <h3 className="font-bold text-xl text-indigo-300">
                {trait.title}
              </h3>
              <p className="text-gray-300 mt-2">{trait.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
