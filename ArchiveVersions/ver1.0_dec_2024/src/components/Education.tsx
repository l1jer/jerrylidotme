import { EducationItem } from '../types'

const professionalDevelopment: EducationItem[] = [
  {
    title: 'JavaScript Development',
    institution: 'General Assembly',
    period: '2021',
  },
  {
    title: 'Senior Frontend Development',
    institution: 'NetEase Cloud Classroom',
    period: '2020',
  },
]

const universityEducation: EducationItem[] = [
  {
    title: 'Graduate Diploma of Information Technology',
    institution: 'University of Canberra',
    period: '2019 – 2020',
  },
  {
    title: 'Double Bachelor Degree',
    subtitle: 'Information Technology & Media Arts and Production',
    institution: 'University of Canberra',
    period: '2013 – 2016',
  },
]

export default function Education() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center">
        Educational Journey
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-3">
            <h3 className="text-xl font-semibold text-indigo-300">
              Professional Development
            </h3>
          </div>
          <div className="space-y-3 text-gray-300">
            {professionalDevelopment.map((item, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">
                  {item.institution} | {item.period}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300">
          <div className="flex items-center mb-3">
            <h3 className="text-xl font-semibold text-indigo-300">
              University Education
            </h3>
          </div>
          <div className="space-y-3 text-gray-300">
            {universityEducation.map((item, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded">
                <p className="font-medium">{item.title}</p>
                {item.subtitle && (
                  <p className="text-sm">{item.subtitle}</p>
                )}
                <p className="text-sm text-gray-400">
                  {item.institution} | {item.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
