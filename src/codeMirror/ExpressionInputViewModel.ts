import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
// import { StreamLanguage } from '@codemirror/stream-parser';

// import { mathematica } from '@codemirror/legacy-modes/mode/mathematica';
// import { lineNumbers } from '@codemirror/gutter';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

class FormulaInputViewModel {
  initialState: EditorState;

  view: EditorView | null = null;

  constructor() {
    // Create initial state for the editor
    this.initialState = EditorState.create({
      doc: '[A] + 1',
      extensions: [
        basicSetup,
        // StreamLanguage.define(mathematica),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // EditorView.updateListener.of((v:{state: any}) => {
        //   // console.log(v.state.doc.text[0]);
        //   this.fireChange(v.state.doc.text[0]);
        // }),
        EditorState.transactionFilter.of((tr) => (tr.newDoc.lines > 1 ? [] : tr)),
        // lineNumbers({ formatNumber: () => 'Formula:' }),
        autocompletion({ override: [this.myCompletions.bind(this)] }),
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
