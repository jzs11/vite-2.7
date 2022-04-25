import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
// import { StreamLanguage } from '@codemirror/stream-parser';

// import { mathematica } from '@codemirror/legacy-modes/mode/mathematica';
// import { lineNumbers } from '@codemirror/gutter';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';

class FormulaInputViewModel {
  initialState: EditorState;

  view: EditorView | null = null;

  constructor() {
    // Create initial state for the editor
    this.initialState = EditorState.create({
      doc: 'console.log("Hello world")',
      extensions: [
        basicSetup,
        javascript(),
      ],
    });
  }

  myCompletions(context: CompletionContext) {
    const word = context.matchBefore(/\w*/);
    if (!word) return null;
    if (word.from === word.to && !context.explicit) { return null; }

    const options = [
      { label: 'addDays', type: 'function', apply: 'addDays(' },
      { label: 'today', type: 'function', apply: 'today(' },
    ];

    return {
      from: word.from,
      options: options.concat(this.getParameterCompletions(context)),
    };
  }

  getParameterCompletions(_context: CompletionContext) {
    // const index = context.pos;
    // const expression = context.state.doc.lineAt(0).text;
    // const needBracket = true;

    // if (expression.charAt(index) === ']') {
    //   needBracket = false;
    // }
    const variables = [{ label: 'A', type: 'variable', apply: '' }];

    return variables;
  }

  insert(syntax: string) {
    if (this.view) {
      const transaction = this.view.state.replaceSelection(syntax);
      const update = this.view.state.update(transaction);
      this.view.update([update]);
    }
  }

  init() {
    this.view = new EditorView({
      parent: document.getElementById('editor') as HTMLTextAreaElement,
      state: this.initialState,
    });
    this.view.focus();
  }
}

export default FormulaInputViewModel;
