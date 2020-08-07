const dogs = async (_, __, { cache }) => {
  console.log('MIAO')
  return [
    {
      id: 'mio',
      breed: 'prova',
      displayImage: 'prova2',
    },
  ]
}

const resolvers = {
  Query: {
    dogs,
  },
}

export default resolvers
