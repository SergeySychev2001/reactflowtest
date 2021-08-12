import React, { useState } from 'react';
import ReactFlow from 'react-flow-renderer';
import '../styles/App.css';
import FlowNodeAdd from './FlowNodeAdd';

const App = () => {
    const [modal, setModal] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const end = () => {
        const nodeEnd = nodes.map((item) => {
            return {
                key: item.id,
                value: item.text
            }
        });
        console.log(JSON.stringify(nodeEnd));
    }

    const addNode = (text, title, prevNodeId) => {
        if(prevNodeId === '0'){
            const newNode = {
                id: '1',
                text,
                title,
                layer: 1,
                parent: 0,
            };
            setNodes([{...newNode}]);
        } else {
            const findedNode = nodes.find(item => item.id === prevNodeId);
            const idx = (+nodes[nodes.length - 1].id + 1).toString();
            const newNode = {
                id: idx,
                text,
                title,
                layer: findedNode.layer + 1,
                parent: +prevNodeId
            };
            const newEdge = {
                id: `e${prevNodeId}-${idx}`,
                source: prevNodeId,
                target: idx
            }
            setNodes([...nodes, newNode]);
            setEdges([...edges, newEdge]);
        }
    }
    const nodeContent = () => {
        const layers = new Map();
        nodes.map(({layer}) => {
            if(!layers.get(layer)){
                layers.set(layer, 1);
            } else {
                layers.set(layer, layers.get(layer) + 1)
            }
        });
        const result = [];
        let prevParent = [];
        for (const entry of layers.entries()) {
            let x = 0;
            const findedNodes = nodes.filter(item => item.layer === entry[0]);
            if(entry[0] === 1){
                result.push({
                    id: findedNodes[0].id,
                    data: {label: <span><strong>{findedNodes[0].title}</strong><br/>{findedNodes[0].text}</span>},
                    position: {x: 200 * 1 , y: 100 * findedNodes[0].layer},
                    draggable: false,
                    style: {
                        opacity: 1
                    }
                });
                prevParent = [1];
            } else {
                const e = prevParent.map(i => findedNodes.filter(item => item.parent == i));
                prevParent = [];
                (e.flat()).map(item => {
                    prevParent.push(item.id)
                    result.push(
                        {
                            id: item.id,
                            data: {label: <span><strong>{item.title}</strong><br/>{item.text}</span>},
                            position: {x , y: 100 * item.layer},
                            draggable: false
                        }
                    );
                    x += 200
                });
            }
        }
        return result;
    }
    
    return(
        <div className="app">
            {modal ? (
                <FlowNodeAdd    closeModal={() => setModal(false)} 
                                prevNodeId={modal} 
                                addNode={(text, title, prevNodeId) => addNode(text, title, prevNodeId)}/>
            ) : undefined}
        <div className="app__flow">
            {nodes.length > 0
                ? (
                    <>
                        <ReactFlow 
                        elements={[...nodeContent(), ...edges]}
                        onElementClick={(e) => setModal(e.target.dataset.id)}/>
                        <button className="app__end" onClick={() => end()}>Конец</button>
                    </>
                )
                : <button onClick={() => setModal('0')} className="app__btn">Добавить элемент</button>}
        </div>
        </div>
    )
}

export default App;