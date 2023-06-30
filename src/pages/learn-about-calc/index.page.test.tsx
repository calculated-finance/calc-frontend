import { render, screen } from '@testing-library/react';
import { DcaLearn, DcaPlusLearn, GeneralLearn, LearningHubLinks, WeightedScaleLearn } from './index.page';
import '@testing-library/jest-dom';

describe('learning hub page tests', () => {
  describe('learning hub displays panels', () => {
    it('DCA panel renders', () => {
      render(<DcaLearn />);
      expect(screen.getByText('Dollar Cost Averaging (DCA)')).toBeVisible();
    });

    it('DCA+ panel renders', () => {
      render(<DcaPlusLearn />);
      expect(screen.getByText('Algorithm DCA+')).toBeVisible();
    });

    it('Weighted Scale panel renders', () => {
      render(<WeightedScaleLearn />);
      expect(screen.getByText('Weighted Scale')).toBeVisible();
    });

    it('General Learn panel renders', () => {
      render(<GeneralLearn />);
      expect(screen.getByText('More About CALC')).toBeVisible();
    });
  });

  describe('learning hub links take user to correct location', () => {
    it('DCA button link works', () => {
      render(<DcaLearn />);
      expect(screen.getByRole('link')).toHaveAttribute('href', LearningHubLinks.Dca);
    });

    it('DCA+ button link works', () => {
      render(<DcaPlusLearn />);
      expect(screen.getByRole('link')).toHaveAttribute('href', LearningHubLinks.DcaPlus);
    });

    it('Weighted Scale button link works', () => {
      render(<WeightedScaleLearn />);
      expect(screen.getByRole('link')).toHaveAttribute('href', LearningHubLinks.WeightedScale);
    });

    it('General Learn button link works', () => {
      render(<GeneralLearn />);
      expect(screen.getByRole('link')).toHaveAttribute('href', LearningHubLinks.MoreAboutCalc);
    });
  });
});
