import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";

import { CloseModalButton, ModalDiv, ModalBackdropDiv } from "./BasicModalWindow.styled";

import sprite from "assets/sprite/sprite.svg";

export default function BasicModalWindow(props) {
  const { onShow = true, type, onClose, children } = props;

  const modalRoot = document.querySelector("#modal-root");

  const nodeModalRef = useRef(null);
  const nodeBackdropRef = useRef(null);

  useEffect(() => {
    if (!onShow) return;

    const disableBodyScroll = disable => {
      document.body.style.overflow = disable ? "hidden" : "auto";
    };

    if (onShow || modalRoot.children.length !== 0) {
      disableBodyScroll(true);
    }

    const onEscKeyPress = e => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscKeyPress);

    return () => {
      disableBodyScroll(false);
      window.removeEventListener("keydown", onEscKeyPress);
    };
  }, [modalRoot.children.length, onShow, onClose]);

  return createPortal(
    <>
      <CSSTransition
        in={onShow}
        nodeRef={nodeBackdropRef}
        timeout={400}
        classNames="backdrop-wrapper"
        unmountOnExit
      >
        <ModalBackdropDiv onClick={onClose} ref={nodeBackdropRef} />
      </CSSTransition>

      <CSSTransition
        in={onShow}
        nodeRef={nodeModalRef}
        timeout={400}
        classNames="modal-wrapper"
        unmountOnExit
      >
        <ModalDiv ref={nodeModalRef} type={type}>
          <CloseModalButton onClick={onClose}>
            <svg>
              <use href={`${sprite}#close`} />
            </svg>
          </CloseModalButton>

          {children}
        </ModalDiv>
      </CSSTransition>
    </>,
    modalRoot
  );
}

BasicModalWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onShow: PropTypes.bool,
};
