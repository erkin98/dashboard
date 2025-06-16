import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  it('renders badge with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Badge variant="destructive">Error</Badge>);
    let badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-destructive');

    rerender(<Badge variant="secondary">Info</Badge>);
    badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-secondary');

    rerender(<Badge variant="outline">Outline</Badge>);
    badge = screen.getByText('Outline');
    expect(badge).toHaveClass('border');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Test</Badge>);
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('custom-badge');
  });

  it('forwards additional props', () => {
    render(<Badge data-testid="test-badge">Badge</Badge>);
    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });
}); 