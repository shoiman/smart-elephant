import React from 'react'
import './RewardStar.css'

type RewardStarProps = {
  onClick: () => void
  size?: number
  ariaLabel?: string
}

export default function RewardStar({ onClick, size = 160, ariaLabel = 'Reward' }: RewardStarProps) {
  return (
    <div className="reward-backdrop" role="dialog" aria-modal="true">
      <button
        type="button"
        className="reward-button"
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <span className="reward-star" style={{ fontSize: `${size}px` }} aria-hidden="true">⭐</span>
      </button>
    </div>
  )
}
