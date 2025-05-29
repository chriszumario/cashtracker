"use client"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css"

export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className='flex justify-center w-32 h-32'>
      <CircularProgressbar
        styles={buildStyles({
          pathColor: percentage >= 100 ? '#DC2626' : '#F59E0B',
          trailColor: '#e1e1e1',
          textColor: percentage >= 100 ? '#DC2626' : '#F59E0B',
          textSize: 14,
          pathTransitionDuration: 0.5,
        })}
        text={`${percentage}% Gastado`}
        value={percentage}
      />
    </div>
  )
}
