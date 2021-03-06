// test data

const voltCode = `
use default in firestore;
collection chatRooms {
    read: private();
    write: restricted(members);

    require static int roomName == 110;
    static string name;
    require list members;

}
`;

const tokens = [
    { type: 'word', value: 'use' },
    { type: 'word', value: 'default' },
    { type: 'word', value: 'in' },
    { type: 'word', value: 'firestore' },
    { type: 'semi', value: ';' },
    { type: 'word', value: 'collection' },
    { type: 'word', value: 'chatRooms' },
    { type: 'brace', value: '{' },
    { type: 'word', value: 'read' },
    { type: 'colon', value: ':' },
    { type: 'word', value: 'private' },
    { type: 'paren', value: '(' },
    { type: 'paren', value: ')' },
    { type: 'semi', value: ';' },
    { type: 'word', value: 'write' },
    { type: 'colon', value: ':' },
    { type: 'word', value: 'restricted' },
    { type: 'paren', value: '(' },
    { type: 'word', value: 'members' },
    { type: 'paren', value: ')' },
    { type: 'semi', value: ';' },
    { type: 'word', value: 'require' },
    { type: 'word', value: 'static' },
    { type: 'word', value: 'int' },
    { type: 'word', value: 'roomName' },
    { type: 'cond', value: '==' },
    { type: 'number', value: '110' },
    { type: 'semi', value: ';' },
    { type: 'word', value: 'static' },
    { type: 'word', value: 'string' },
    { type: 'word', value: 'name' },
    { type: 'semi', value: ';' },
    { type: 'word', value: 'require' },
    { type: 'word', value: 'list' },
    { type: 'word', value: 'members' },
    { type: 'semi', value: ';' },
    { type: 'brace', value: '}' }
];

const ast = {
    type: 'firestore',
    name: 'default',
    permissions: [
        {
            type: 'collection',
            name: 'chatRooms',
            permissions: [
                {
                    type: 'access',
                    name: 'read',
                    condition: 'private',
                    param: 'uid'
                },
                {
                    type: 'access',
                    name: 'write',
                    condition: 'restricted',
                    param: 'members'
                },
                {
                    type: 'variable',
                    name: 'roomName',
                    dataType: 'int',
                    required: true,
                    static: true,
                    conditional: {
                        value: '110',
                        relation: '=='
                    }
                },
                {
                    type: 'variable',
                    name: 'name',
                    dataType: 'string',
                    required: false,
                    static: true,
                    conditional: null
                },
                {
                    type: 'variable',
                    name: 'members',
                    dataType: 'list',
                    required: true,
                    static: false,
                    conditional: null
                }
            ]
        }
    ]
};

const finalAst = {
    type: 'firestore',
    name: 'default',
    collections: [
        {
            name: 'chatRooms',
            access: {
                read: {
                    type: 'private',
                    variable: 'uid'
                },
                write: {
                    type: 'restricted',
                    variable: 'members'
                }
            },
            variables: [
                {
                    type: 'int',
                    name: 'roomName',
                    condition: '== 110',
                    required: true,
                    static: true
                },
                {
                    type: 'string',
                    name: 'name',
                    condition: null,
                    required: false,
                    static: true
                },
                {
                    type: 'list',
                    name: 'members',
                    condition: null,
                    required: true,
                    static: false
                }
            ],
            documents: [],
            collections: [],
        }
    ],
    documents: []
};

const rulesCode = `service cloud.firestore {

\tmatch /databases/{database}/documents {

\t\tmatch /chatRooms/{chatRoom=**} {

\t\t\tallow read: if request.auth.uid == resource.data.uid
\t\t\t\t&& request.resource.data.roomName is int
\t\t\t\t&& request.resource.data.roomName == 110
\t\t\t\t&& request.resource.data.roomName == resource.data.roomName
\t\t\t\t&& request.resource.data.name is string
\t\t\t\t&& request.resource.data.name == resource.data.name
\t\t\t\t&& request.resource.data.members is list;

\t\t\tallow write: if request.auth.uid in resource.data.members
\t\t\t\t&& request.resource.data.roomName is int
\t\t\t\t&& request.resource.data.roomName == 110
\t\t\t\t&& request.resource.data.roomName == resource.data.roomName
\t\t\t\t&& request.resource.data.name is string
\t\t\t\t&& request.resource.data.name == resource.data.name
\t\t\t\t&& request.resource.data.members is list;
\t\t}
\t}
}`;

module.exports = {
    voltCode,
    tokens,
    ast,
    finalAst,
    rulesCode,
};
