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
        value: 'drafted',
    },
    {
        code: 3,
        value: 'trashed',
    },
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

export const bannerTypes = [
    {
        code: 1,
        label: 'Image Only',
    },
    {
        code: 2,
        label: 'Image with Overlay Elements',
    },
    {
        code: 3,
        label: 'Program Highlight – Image',
    },
    {
        code: 4,
        label: 'Program Highlight – Video',
    },
    // {
    //     code: 5,
    //     label: 'Video Only',
    // },
    {
        code: 6,
        label: 'Video with Overlay Elements',
    },
];

