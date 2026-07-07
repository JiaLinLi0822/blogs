import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <div id="quartz-body">
      <a
        class="global-home-button"
        href="https://jialinli0822.github.io/"
        aria-label="Back to Homepage"
      >
        ← Homepage
      </a>
      {children}
    </div>
  )
}

export default (() => Body) satisfies QuartzComponentConstructor
