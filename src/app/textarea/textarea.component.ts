import { Component, EventEmitter, Input, Output } from "@angular/core";
import {StreamChatModule, TextareaInterface} from "stream-chat-angular";

@Component({
  selector: "app-textarea",
  template: `
    <button (click)="setToBold(input)">Bold</button>
    <textarea
      style="width: 100%"
      [value]="value || ''"
      #input
      placeholder="Type your message here"
      rows="1"
      (input)="inputChanged(input.value)"
      (keydown.enter)="enterHit($event)"
    ></textarea>
  `,
  standalone:true,
  styles: [":host {width: 100%}"],
  imports:[StreamChatModule]
})
export class TextareaComponent implements TextareaInterface {
  @Input() value = "";
  @Output() readonly valueChange = new EventEmitter<string>();
  @Output() readonly send = new EventEmitter<void>();

  constructor() {}

  inputChanged(value: string) {
    this.valueChange.emit(value);
  }

  setToBold(input: HTMLTextAreaElement) {
    const currentValue = input.value;
    const newValue = `<b>${currentValue}</b>`;
    input.value = newValue;
    this.inputChanged(newValue);
  }

  enterHit(event: Event) {
    event.preventDefault();
    this.send.next();
  }
}
