import {format} from "date-fns";
export default function Post({title,summary,cover,content,createdAt}){
    return(
        <div className="entry">
        <div className="image"><img src="https://images.newscientist.com/wp-content/uploads/2024/05/24140958/sei204548736.png?width=900 " alt=""/></div>
        
      <div className="texts">
      <h2>{title}</h2>
      <p className="info">
        <a className="author">Anshita Raj</a>
        <time> {format(new Date(createdAt),'MMM d, yyyy HH:mm ')}</time>
      </p>
      <p className="summary">{summary}</p>
      </div>
      </div>
    );
}