const description = "This is description This is description This is description This is description This is description This is description This is description This is description This is description This is description "
const options = {
  'Y80100000-Y80100200': {
    customData: {
      description: "This is small Description"
    },
    id: 'Y80100000-Y80100200'
  },
  "Y80100000-Y80100100": {
    customData: {
      description: description
    },
    id: 'Y80100000-Y80100100'
  },
  "Y35000000-Y35100300": {
    customData: {
      description: description
    },
    id: 'Y35000000-Y35100300'
  },
  "Y35000000-Y35100100": {
    customData: {
      description: description
    },
    id: 'Y35000000-Y35100100'
  },
  "Marketing": {
    customData: {
      description: description
    },
    id: 'Marketing'
  }
}

export default function (id) {
  return Promise.resolve(options[id])
}