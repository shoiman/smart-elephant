import { useEffect, useState } from 'react'
import './Popup.css'

const ANIMATION_DURATION = 220

type PopupProps = {
  title: string
  message: string
  onClose: () => void
}

export default function Popup({ title, message, onClose }: PopupProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // delay to allow CSS transition from hidden -> shown
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  function handleClose() {
  setVisible(false)
  setTimeout(onClose, ANIMATION_DURATION)
}

  return (
    <div className={`popup-backdrop ${visible ? 'show' : ''}`} onClick={handleClose}>
      <div className={`popup ${visible ? 'show' : ''}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"  aria-labelledby="popup-title">
        <div className="popup-header">
          <h3 id="popup-title" className="popup-title">{title}</h3>
            <div className="popup-actions">
            <button className="popup-button" onClick={handleClose}>
                Продолжить
            </button>
            </div>
        </div>
        <div className="popup-body">{message}</div>
      </div>
    </div>
  )
}
