import octonode from 'octonode'

const client = octonode.client(process.env.GITHUB_TOKEN)

export default client

