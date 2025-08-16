import React, { useEffect, useRef } from 'react';
import type { FlyingResource } from '../types';
import { StardustIcon, NebulaGasIcon, ResearchIcon } from './icons';

interface FlyingResourceProps {
    resource: FlyingResource;
    onAnimationEnd: (id: number) => void;
}

const getIcon = (type: FlyingResource['type']) => {
    switch (type) {
        case 'stardust': return <StardustIcon />;
        case 'nebulaGas': return <NebulaGasIcon />;
        case 'researchPoints': return <ResearchIcon />;
        default: return null;
    }
};

const getTargetElementId = (type: FlyingResource['type']) => {
    switch (type) {
        case 'stardust': return 'resource-stardust';
        case 'nebulaGas': return 'resource-nebulaGas';
        case 'researchPoints': return 'resource-researchPoints';
        default: return null;
    }
}

const FlyingResourceComponent: React.FC<FlyingResourceProps> = ({ resource, onAnimationEnd }) => {
    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const targetId = getTargetElementId(resource.type);
        if(!targetId) return;

        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        
        const targetRect = targetEl.getBoundingClientRect();
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;

        const startX = resource.startX;
        const startY = resource.startY;

        el.style.left = `${startX}px`;
        el.style.top = `${startY}px`;

        const animation = el.animate([
            { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1, offset: 0 },
            { transform: `translate(-50%, -50%) scale(1) translate(${(endX - startX) * 0.2}px, ${(endY - startY) * 0.2 - 60}px)`, opacity: 1, offset: 0.3 },
            { transform: `translate(-50%, -50%) scale(0.5) translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0.5, offset: 1 }
        ], {
            duration: 500,
            easing: 'cubic-bezier(0.5, 0, 1, 1)',
            fill: 'forwards'
        });

        animation.onfinish = () => onAnimationEnd(resource.id);

    }, [resource, onAnimationEnd]);


    return (
        <div ref={elRef} className="flying-resource">
            {getIcon(resource.type)}
        </div>
    );
};


const FlyingResourcesContainer: React.FC<{ resources: FlyingResource[], onAnimationEnd: (id: number) => void }> = ({ resources, onAnimationEnd }) => {
    return (
        <>
            {resources.map(resource => (
                <FlyingResourceComponent key={resource.id} resource={resource} onAnimationEnd={onAnimationEnd} />
            ))}
        </>
    );
};

export default FlyingResourcesContainer;