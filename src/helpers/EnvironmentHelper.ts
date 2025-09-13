const development: boolean = import.meta.env.MODE === 'development' || import.meta.env.DEV;

export default function isDev(): boolean
{
    return development;
}