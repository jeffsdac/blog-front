export interface IPublicPostDTO {
    id: string,
    title: string,
    content: string,
    authorId: string,
    authorUsername: string,
    likeVotes: number,
    unlikeVotes: number;
    createdAt: Date
}
