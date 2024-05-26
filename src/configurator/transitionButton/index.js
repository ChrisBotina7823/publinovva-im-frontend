import 'index.css'
import { CSSTransition } from 'react-transition-group'

export function TransitionButton({children,visible}) {
    return (
        <CSSTransition
        in={visible}
        timeout={300}
        classNames="my-node"
        unmountOnExit
      >
        {children}
      </CSSTransition>
    )
}