import React from 'react'
import '../styles/FlowNodeAdd.css';
import closeBtn from '../images/close-btn.svg';

const FlowNodeAdd = ({
    closeModal,
    addNode,
    prevNodeId
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        addNode(e.target.text.value, e.target.title.value, prevNodeId);
        closeModal();
    };
    return(
        <div className="flow-node-add">
            <form onSubmit={handleSubmit} className="flow-node-add__container">
                <img onClick={() => closeModal()} className="flow-node-add__close" src={closeBtn} alt="Закрыть" />
                <input type="text" name="title" placeholder="Заголовок элемента"/>
                <input type="text" name="text" placeholder="Значение элемента"/>
                <input type="submit" value="Добавить"/>
            </form>
        </div>
    )
}

export default FlowNodeAdd;