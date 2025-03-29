import type { Widget } from 'tiddlywiki';

export function navigateToTiddler(title: string, parentWidget?: Widget) {
  // layouts should implement "open default layout" on their own.
  parentWidget?.dispatchEvent({
    type: 'tm-navigate',
    navigateTo: title,
  });
}
