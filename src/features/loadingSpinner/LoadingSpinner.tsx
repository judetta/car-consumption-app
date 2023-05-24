import PropagateLoader from 'react-spinners/PropagateLoader';

import './LoadingSpinner.scss';

export function LoadingSpinner() {
  return (
    <div className="LoadingSpinner">
      <PropagateLoader loading={true} color='#161616' />
    </div>
  );
}