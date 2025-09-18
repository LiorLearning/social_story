import React, { useState } from 'react';
import { X, Heart, Flag, Send, Smile, Image } from 'lucide-react';
import { Story } from '@/data/stories';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  timestamp: string;
  replies?: Comment[];
}

interface CommentsModalProps {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ story, isOpen, onClose }) => {
  const [newComment, setNewComment] = useState('');
  
  // Generate dynamic comments based on story
  const generateCommentsForStory = (story: Story): Comment[] => {
    const commentPool: (Comment & { storyIds: string[] })[] = [
      // Story 1: Reese & the Geyser Eggs of Yellowstone (5 comments)
      {
        id: '1',
        storyIds: ['1'],
        author: { name: 'Sophia', avatar: '/a-s.png' },
        content: 'OMG the geyser eggs are SO cool!! What do u think comes out of them?? 🥚✨',
        likes: 5,
        isLiked: false,
        timestamp: '3h ago'
      },
      {
        id: '2',
        storyIds: ['1'],
        author: { name: 'Marcus', avatar: '/a-m2.png' },
        content: 'Reese is super brave! I wanna go to Yellowstone now and find eggs too!',
        likes: 2,
        isLiked: false,
        timestamp: '5h ago'
      },
      {
        id: '3',
        storyIds: ['1'],
        author: { name: 'Luna', avatar: '/a-l.png' },
        content: 'This story made me feel like I was really there with Reese! So awesome!',
        likes: 3,
        isLiked: false,
        timestamp: '1d ago'
      },
      {
        id: '4',
        storyIds: ['1'],
        author: { name: 'Kai', avatar: '/a-k.png' },
        content: 'Best story ever!! Please write more Reese adventures! 🔥',
        likes: 1,
        isLiked: false,
        timestamp: '2d ago'
      },
      {
        id: '5a',
        storyIds: ['1'],
        author: { name: 'Emma', avatar: '/a-em2.png' },
        content: 'I wanna visit Yellowstone now! Do real geysers have eggs like this? 🌋',
        likes: 2,
        isLiked: false,
        timestamp: '1d ago'
      },

      // Story 2: The Banana Monkey & Jaguar Battles (12 comments total - 6 main + 6 replies = 50% replies)
      {
        id: '5',
        storyIds: ['2'],
        author: { name: 'Isabella', avatar: '/a-i.png' },
        content: 'The banana monkey is SO funny!! 🐒🍌 I cant stop laughing!',
        likes: 8,
        isLiked: false,
        timestamp: '1h ago'
      },
      {
        id: '6',
        storyIds: ['2'],
        author: { name: 'Diego', avatar: '/a-d.png' },
        content: 'WOW the fights are EPIC!! Monkey vs jaguar was the best part ever!',
        likes: 6,
        isLiked: false,
        timestamp: '2h ago',
        replies: [
          {
            id: '6-1',
            author: { name: 'Zara', avatar: '/a-z.png' },
            content: 'I know right!! Connor is the best writer! 🔥',
            likes: 3,
            isLiked: false,
            timestamp: '1h ago'
          },
          {
            id: '6-2',
            author: { name: 'Oliver', avatar: '/a-o.png' },
            content: 'My favorite part was when monkey threw bananas like ninja stars!',
            likes: 4,
            isLiked: false,
            timestamp: '1h ago'
          }
        ]
      },
      {
        id: '7',
        storyIds: ['2'],
        author: { name: 'Maya', avatar: '/a-ma.png' },
        content: 'I love the banana boomerang!! Thats so cool! Can monkeys really do that? 🍌',
        likes: 5,
        isLiked: false,
        timestamp: '4h ago',
        replies: [
          {
            id: '7-1',
            author: { name: 'Ethan', avatar: '/a-e2.png' },
            content: 'Probably not but it would be awesome if they could!',
            likes: 2,
            isLiked: false,
            timestamp: '3h ago'
          }
        ]
      },
      {
        id: '8',
        storyIds: ['2'],
        author: { name: 'Aria', avatar: '/a-ar.png' },
        content: 'Me and my little brother read this every night! He loves the monkey sounds 🐒',
        likes: 7,
        isLiked: false,
        timestamp: '6h ago',
        replies: [
          {
            id: '8-1',
            author: { name: 'Finn', avatar: '/a-f.png' },
            content: 'Thats so cute! I read it to my sister too!',
            likes: 3,
            isLiked: false,
            timestamp: '5h ago'
          },
          {
            id: '8-2',
            author: { name: 'Maya', avatar: '/a-may.png' },
            content: 'Same! My baby cousin always asks for the monkey story! 🐵',
            likes: 2,
            isLiked: false,
            timestamp: '4h ago'
          }
        ]
      },
      {
        id: '9',
        storyIds: ['2'],
        author: { name: 'Leo', avatar: '/a-le.png' },
        content: 'The jaguar and monkey becoming friends is my favorite part! 🐆🐒',
        likes: 5,
        isLiked: false,
        timestamp: '8h ago',
        replies: [
          {
            id: '9-1',
            author: { name: 'Zoe', avatar: '/a-zo2.png' },
            content: 'Yes! It shows that different animals can be friends too!',
            likes: 4,
            isLiked: false,
            timestamp: '7h ago'
          }
        ]
      },
      {
        id: '10',
        storyIds: ['2'],
        author: { name: 'Nova', avatar: '/a-no.png' },
        content: 'I wish I could swing through trees like the monkey! That looks so fun! 🌳',
        likes: 3,
        isLiked: false,
        timestamp: '12h ago',
        replies: [
          {
            id: '10-1',
            author: { name: 'River', avatar: '/a-ri.png' },
            content: 'Me too! Maybe we can build a treehouse and pretend!',
            likes: 2,
            isLiked: false,
            timestamp: '10h ago'
          }
        ]
      },
      {
        id: '11',
        storyIds: ['2'],
        author: { name: 'Phoenix', avatar: '/a-ph.png' },
        content: 'Connor writes the BEST animal stories! Please make more! 🌟',
        likes: 6,
        isLiked: false,
        timestamp: '1d ago',
        replies: [
          {
            id: '11-1',
            author: { name: 'Atlas', avatar: '/a-at.png' },
            content: 'Totally agree! Maybe next time with elephants or lions!',
            likes: 3,
            isLiked: false,
            timestamp: '20h ago'
          }
        ]
      },

      // Story 3: The Mischievous Teacher (7 comments)
      {
        id: '19',
        storyIds: ['3'],
        author: { name: 'Hazel', avatar: '/a-h.png' },
        content: 'OMG Nevy your teacher is SO funny! I wish mine did pranks too! 📚😂',
        likes: 6,
        isLiked: false,
        timestamp: '2h ago'
      },
      {
        id: '20',
        storyIds: ['3'],
        author: { name: 'Jasper', avatar: '/a-j.png' },
        content: 'HAHA the part where the teacher hid the chalk made me laugh so hard!! 😂',
        likes: 4,
        isLiked: false,
        timestamp: '6h ago'
      },
      {
        id: '21',
        storyIds: ['3'],
        author: { name: 'Ruby', avatar: '/a-ru.png' },
        content: 'My teacher is boring but this one sounds AWESOME! I wanna be in that class!',
        likes: 3,
        isLiked: false,
        timestamp: '1d ago'
      },
      {
        id: '22',
        storyIds: ['3'],
        author: { name: 'Orion', avatar: '/a-or.png' },
        content: 'Cool story! It shows teachers can be fun too not just serious all the time',
        likes: 2,
        isLiked: false,
        timestamp: '2d ago'
      },
      {
        id: '23a',
        storyIds: ['3'],
        author: { name: 'Emma', avatar: '/a-em.png' },
        content: 'I wish my teacher was like this! Mine just gives us homework all day 😭',
        likes: 4,
        isLiked: false,
        timestamp: '3h ago'
      },
      {
        id: '24a',
        storyIds: ['3'],
        author: { name: 'Liam', avatar: '/a-li.png' },
        content: 'The invisible ink part was GENIUS! How did the teacher even think of that??',
        likes: 3,
        isLiked: false,
        timestamp: '5h ago'
      },
      {
        id: '25a',
        storyIds: ['3'],
        author: { name: 'Ava', avatar: '/a-av.png' },
        content: 'This made me laugh so much! My mom heard me giggling from my room 😂',
        likes: 6,
        isLiked: false,
        timestamp: '8h ago'
      },

      // Story 4: John Doe, the Ice Monster (4 comments)
      {
        id: '30a',
        storyIds: ['4'],
        author: { name: 'Ivy', avatar: '/a-iv.png' },
        content: 'The ice monster isnt scary! Hes actually really nice! I wanna be his friend ❄️😊',
        likes: 3,
        isLiked: false,
        timestamp: '4h ago'
      },
      {
        id: '31a',
        storyIds: ['4'],
        author: { name: 'Asher', avatar: '/a-as.png' },
        content: 'This story taught me not to judge people by how they look! John Doe is cool!',
        likes: 2,
        isLiked: false,
        timestamp: '1d ago'
      },
      {
        id: '32a',
        storyIds: ['4'],
        author: { name: 'Grace', avatar: '/a-gr.png' },
        content: 'I thought he was gonna be mean but hes just lonely! Now I wanna give him a hug 🤗',
        likes: 5,
        isLiked: false,
        timestamp: '2h ago'
      },
      {
        id: '33a',
        storyIds: ['4'],
        author: { name: 'Jack', avatar: '/a-ja.png' },
        content: 'The ice castle sounds AMAZING! I wish I could visit it and slide down the ice slides!',
        likes: 4,
        isLiked: false,
        timestamp: '6h ago'
      },

      // Story 5: Mila and Vivienne's Adventure Diary (3 comments)
      {
        id: '38a',
        storyIds: ['5'],
        author: { name: 'Skye', avatar: '/a-sk.png' },
        content: 'I LOVE sister stories!! Me and my sister go on adventures too! 👭✨',
        likes: 4,
        isLiked: false,
        timestamp: '3h ago'
      },
      {
        id: '39a',
        storyIds: ['5'],
        author: { name: 'Rowan', avatar: '/a-ro.png' },
        content: 'The diary thing is so cool! It feels like reading someones real diary!',
        likes: 1,
        isLiked: false,
        timestamp: '8h ago'
      },
      {
        id: '40a',
        storyIds: ['5'],
        author: { name: 'Lily', avatar: '/a-lil.png' },
        content: 'Mila and Vivienne are such good sisters! I wish me and my sister got along like that 💕',
        likes: 8,
        isLiked: false,
        timestamp: '1h ago'
      }
    ];

    // Filter comments for this specific story and limit to the story's comment count
    const storyComments = commentPool
      .filter(comment => comment.storyIds.includes(story.id))
      .slice(0, story.comments)
      .map(comment => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        likes: comment.likes,
        isLiked: comment.isLiked,
        timestamp: comment.timestamp,
        replies: comment.replies
      }));

    return storyComments;
  };

  const [comments, setComments] = useState<Comment[]>(() => generateCommentsForStory(story));

  // Update comments when story changes
  React.useEffect(() => {
    setComments(generateCommentsForStory(story));
  }, [story.id]);

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: { name: 'You', avatar: '/a-user.png' },
      content: newComment.trim(),
      likes: 0,
      isLiked: false,
      timestamp: 'now'
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img 
              src={story.cover} 
              alt={story.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{story.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Comments Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h4 className="font-semibold text-gray-900">
            Comments ({comments.length})
          </h4>
          <select className="text-sm text-gray-600 border-none bg-transparent focus:outline-none">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Most liked</option>
          </select>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-medium text-sm">
                    {comment.author.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      Reply
                    </button>
                    <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      <Flag className="w-3 h-3" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.map((reply) => (
                <div key={reply.id} className="ml-11 flex space-x-3">
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-medium text-xs">
                      {reply.author.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{reply.author.name}</span>
                      <span className="text-xs text-gray-500">{reply.timestamp}</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{reply.content}</p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-3 h-3" />
                        <span>{reply.likes}</span>
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        Reply
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        <Flag className="w-3 h-3" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a kind comment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={2}
              />
            </div>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-colors"
            >
              Send
            </button>
          </div>
          
          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Image className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Be kind. No personal info.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
