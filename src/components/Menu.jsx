import { useRef, useState } from 'react'

const menuItems = ['Paralympiques', 'Olympiques']

const Item = ({ text, onClick, active, index }) => {
  return (
    <span
      className={active ? 'active' : ''}
      onClick={() => {
        window.scrollTo(0, 0)
        onClick(index)
      }}>
      {text}
    </span>
  )
}

function Menu(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  const { activeIndex, setActiveIndex } = props

  return (
    <>
      <div id="menuContainer" ref={ref}>
        {menuItems.map((text, i) => (
          <Item key={text} text={text} active={i === activeIndex} index={i} onClick={setActiveIndex} />
        ))}
      </div>
    </>
  )
}
export default Menu
