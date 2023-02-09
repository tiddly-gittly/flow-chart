import type { Widget } from 'tiddlywiki';

export function navigateToTiddlerInDefaultLayout(title: string, parentWidget?: Widget) {
  $tw.wiki.setText('$:/layout', 'text', '');
  parentWidget?.dispatchEvent({
    type: 'tm-navigate',
    navigateTo: title,
  });
}
