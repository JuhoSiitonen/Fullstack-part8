const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")
const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const allBooks = await Book.find({})
      if (!args.author && !args.genre) {
        return allBooks
      }
      if (!args.genre) {
        const auth = await Author.findOne({ name: args.author })
        if (!auth) {
          return null
        }
        return allBooks.filter((book) => String(book.author) === String(auth._id))
      }
      if (!args.author) {
        return allBooks.filter((book) => book.genres.includes(args.genre))
      }
      const auth = await Author.findOne({ name: args.name })
      return allBooks
        .filter((book) => book.genres.includes(args.genre))
        .filter((book) => String(book.author) === String(auth._id))
    },
    allAuthors: async () => {
      const allBooks = await Book.find({})
      const allAuthors = await Author.find({})
      return allAuthors.map((author) => {
        const count = allBooks.filter(
          (book) => String(book.author) === String(author._id)
        )
        return { name: author.name, born: author.born, bookCount: count.length }
      })
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, context) => {
      console.log("addbook alkaa")
      const currentUser = context.currentUser
      if (!currentUser) {
        console.log("autentikaatio meni pieleen")
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const auth = await Author.findOne({ name: args.name })
      let book
      if (!auth) {
        const newAuth = new Author({ name: args.name })
        try {
          await newAuth.save()
        } catch (error) {
          console.log("uuden kirjailijan tallennus epäonnistuu")
          throw new GraphQLError("Saving new author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          })
        }
        book = new Book({ ...args, author: newAuth._id })
      } else {
        book = new Book({ ...args, author: auth._id })
      }
      try {
        await book.save()
      } catch (error) {
        console.log("kirjan tallennus epäonnistui")
        throw new GraphQLError("Saving new book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        })
      }
      console.log("pubsubi alkaa")
      pubsub.publish("BOOK_ADDED", { bookAdded: book })
      console.log("addbook loppuu, subi kutsuttu")
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }
      const authToChange = await Author.findOne({ name: args.name })
      authToChange.born = args.setBornTo
      await authToChange.save()
      return authToChange
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
