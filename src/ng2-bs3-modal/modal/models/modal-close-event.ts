import { BsModalCloseSource } from './modal-close-source';

export interface BsModalCloseEvent {
    event: Event;
    type: BsModalCloseSource;
}

