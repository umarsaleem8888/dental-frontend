import { Loader2 } from 'lucide-react';
import React from 'react';

interface Props {
    color: string;
    size: string;
}

const Loading: React.FC<Props> = ({ color, size }) => {
    return (
        <div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-pulse shadow-md">
                <Loader2
                    className="animate-spin"
                    style={{
                        color: color,
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                />
            </div>
        </div>
    );
};

export default Loading;
