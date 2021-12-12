export interface IFtProfile {
    id: string;
    username: string;
    displayName: string;
    name: { 
      familyName:  string;
      givenName:  string;
    };
    profileUrl: string;
    emails: [ 
      { 
        value:  string; 
      } 
    ],
    phoneNumbers: [ 
      { 
        value: string;
      } 
    ],
    photos: [{
      value: string;
      }],
    provider: string;
}


//  id: '71173',
//  username: 'hheimerd',
//  displayName: 'Holli Heimerdinger',
//  name: { familyName: 'Heimerdinger', givenName: 'Holli' },
//  profileUrl: 'https://api.intra.42.fr/v2/users/hheimerd',
//  emails: [ { value: 'hheimerd@student.21-school.ru' } ],
//  phoneNumbers: [ { value: 'hidden' } ],
//  photos: [ { value: 'https://cdn.intra.42.fr/users/default.png' } ],
//  provider: '42',