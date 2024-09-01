import { useNavigate, useParams } from 'react-router-dom';

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        navigate={navigate}
        params={params}
      />
    );
  }

  return ComponentWithRouterProp;
}
