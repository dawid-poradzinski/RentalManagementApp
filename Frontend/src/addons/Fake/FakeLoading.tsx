import type React from 'react';

type Props = {fakeItem : React.ComponentType}

function FakeLoading(props : Props) {
    return (
        <div className="grid-render animate-pulse">
            {
                Array.from({length: 10}).map((_, i) => (
                    <props.fakeItem />
                ))
            }
        </div>
    )
}

export default FakeLoading