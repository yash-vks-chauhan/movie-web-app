import { Controls } from './Controls'
import { Gradient } from './Gradient'
import { Heading } from './Heading'
import { Loader } from './Loader'
import { Wrapper } from './Wrapper'

export function DesktopControls() {
  return (
    <Wrapper>
      <Gradient position='top' />
      <Gradient position='bottom' />
      <Loader />
      <Heading.Root>
        <Heading.Title />
        <Heading.Buttons>{/* TODO: Share Button */}</Heading.Buttons>
      </Heading.Root>
      <Controls.Root>
        <Controls.Buttons>
          <Controls.Side side='left'></Controls.Side>
          <Controls.Side side='right'></Controls.Side>
        </Controls.Buttons>
      </Controls.Root>
    </Wrapper>
  )
}
