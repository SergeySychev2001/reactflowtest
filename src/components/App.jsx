import { map } from 'lodash';
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
                childrens: 0
            };
            setNodes([{...newNode}]);
        } else {
            const findedNode = nodes.find(item => item.id === prevNodeId);
            const idx = (+nodes[nodes.length - 1].id + 1).toString();
            findedNode.childrens += 1;
            const newNode = {
                id: idx,
                text,
                title,
                layer: findedNode.layer + 1,
                parent: +prevNodeId,
                childrens: 0
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
        const layers = [];
        nodes.map(({layer, childrens}) => {
            const findedLayer = layers.find(({key}) => key === layer);
            if(!findedLayer){
                layers.push({
                    key: layer,
                    value: 1,
                    maxChildrens: childrens,
                    nodeWidth: 180
                });
            } else {
                findedLayer.value += 1;
                if(childrens > findedLayer.maxChildrens){
                    findedLayer.maxChildrens = childrens;
                }
            }
        });
        (layers.reverse()).map((layer) => {
            const prevLayer = layers.find(prevLayer => prevLayer.key === layer.key - 1)
            if(prevLayer){
                prevLayer.nodeWidth = layer.nodeWidth * prevLayer.maxChildrens
            }
        });
        const result = [];
        let prevParent = [];
        for (const layer of layers.reverse()) {
            const findedNodes = nodes.filter(item => item.layer === layer.key);
            if(findedNodes[0].layer === 1){
                result.push({
                    id: findedNodes[0].id,
                    data: {label: <span><strong>{findedNodes[0].title}</strong><br/>{findedNodes[0].text}</span>},
                    position: {x: (layer.nodeWidth) / 2 , y: 100 * findedNodes[0].layer},
                    draggable: false,
                    style: {
                        opacity: 1,
                        backgroundColor: 'green'
                    }
                });
                prevParent = [{
                    id: 1,
                    positionBegin: 0,
                    positionEnd: layer.nodeWidth
                }];
            } else {
                const currentParent = [...prevParent]
                const e = currentParent.map(({id}) => findedNodes.filter(item => item.parent == id));
                prevParent = [];
                e.map((items, idx) => {
                    let x1 = currentParent[idx].positionBegin;
                    let x2 = currentParent[idx].positionEnd;
                    items.map((item, idx) => {
                        prevParent.push({
                            id: item.id,
                            positionBegin: x1,
                            positionEnd: x2
                        });
                        result.push(
                            {
                                id: item.id,
                                data: {label: <span><strong>{item.title}</strong><br/>{item.text}</span>},
                                position: {x: (x1 + (layer.nodeWidth / 2)) , y: 100 * item.layer},
                                draggable: false,
                                style: item.childrens === 0 ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }
                            }
                        );
                        x1 += layer.nodeWidth;
                        x2 += layer.nodeWidth;
                    });
                    
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