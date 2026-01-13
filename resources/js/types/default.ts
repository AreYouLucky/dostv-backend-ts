export type programTypeProps = {
    code: string,
    value: string
}

export const programType = [
    {
        code: '1',
        value: 'Video'
    },
    {
        code: '2',
        value: 'Blogs'
    }
];

export type postStatusProps = {
    code: string,
    value: string
}


export const postStatus = [
    {
        code: 1,
        value: 'published',
    },
    {
        code: 2,
        value: 'draft',
    },
    {
        code: 3,
        value: 'trash',
    }
]

export const platforms = [
    {
        code: 1,
        value: 'YouTube',
    },
    {
        code: 2,
        value: 'Facebook',
    },
    {
        code: 3,
        value: 'Tiktok',
    },
]
