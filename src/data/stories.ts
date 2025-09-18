export interface Story {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  age: string;
  rating: number;
  reactions: {
    heart: number;
  };
  comments: number;
  cover: string;
  country: string;
  badge?: string;
  progress?: number;
}

export const stories: Story[] = [
  {
    id: "1",
    title: "Reese & the Geyser Eggs of Yellowstone",
    author: { name: "Reese G", avatar: "/a-js.png" },
    age: "10 years old",
    rating: 4.8,
    reactions: { heart: 8 },
    comments: 5,
    cover: "/covers/Reese-Adv.png",
    country: "USA",
    badge: "Trending"
  },
  {
    id: "2",
    title: "The Monkey & Jaguar Battles",
    author: { name: "Connor", avatar: "/a-el.png" },
    age: "10 years old",
    rating: 4.7,
    reactions: { heart: 15 },
    comments: 12,
    cover: "/covers/Connor-banana.png",
    country: "USA"
  },
  {
    id: "3",
    title: "The Mischievous Teacher",
    author: { name: "Nevy", avatar: "/a-cb.png" },
    age: "11 years old",
    rating: 4.9,
    reactions: { heart: 11 },
    comments: 7,
    cover: "/covers/Gaia-School.png",
    country: "UK",
    badge: "Teacher Pick"
  },
  {
    id: "4",
    title: "John Doe, the Ice Monster",
    author: { name: "Connor", avatar: "/a-js.png" },
    age: "10 years old",
    rating: 4.6,
    reactions: { heart: 6 },
    comments: 4,
    cover: "/covers/Icyterrain.png",
    country: "UK"
  },
  {
    id: "5",
    title: "Mila and Vivienne's Adventure Diary",
    author: { name: "Mila", avatar: "/a-cb.png" },
    age: "10 years old",
    rating: 4.8,
    reactions: { heart: 5 },
    comments: 3,
    cover: "/covers/Mila-and-Vivienne.png",
    country: "USA",
    badge: "New"
  }
];