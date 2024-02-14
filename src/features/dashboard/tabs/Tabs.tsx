import { FC, ReactNode } from "react";

interface Props{
    children?: ReactNode
    isSelected: string
}

const Tabs: FC<Props> = ({children,isSelected, ...props}) => {
    return (
        <>
            <button className={isSelected ? 'active' : undefined} {...props}>
                {children}
            </button>
        </>
    )
};



export default Tabs;