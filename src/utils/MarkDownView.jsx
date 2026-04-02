import ReactMarkdown from 'react-markdown';
import './MarkdownView.css';

const MarkdownView = ({ content }) => {
    return (
        <div className="markdown-container">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};

export default MarkdownView;