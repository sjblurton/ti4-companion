import { useState, useMemo } from 'react'
import {
  Dialog,
} from '@material-ui/core'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Highlighter from 'react-highlight-words'

import sprite from '../../assets/relic-sprite.jpg'
import translations from '../../i18n'

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${sprite})`,
    backgroundSize: 'auto 100%',
    width: ({ width }) => width,
    height: ({ height }) => height,
    fontSize: ({ fontSize }) => fontSize,
    borderRadius: '4%',
    position: 'relative',
    '& p': {
      margin: 0,
      padding: 0,
      textAlign: 'center',
      whiteSpace: 'normal',
      lineHeight: 1.5,
      fontSize: '0.9em',
    },
  },
  number: {
    marginTop: 0,
    textAlign: 'center',
    fontSize: ({ fontSize }) => fontSize,
  },
  mask: {
    backgroundColor: '#06050b',
    position: 'absolute',
  },
  titleMask: {
    top: '3%',
    width: '77%',
    left: '11%',
    height: '13%',
    display: 'flex',
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  effectMask: {
    top: '24%',
    width: '80%',
    left: '10%',
    height: '70%',
    '& p': {
      height: '100%',
      overflow: 'auto',
    },
  },
})

const SMALL_SIZE = {
  width: 100,
  height: 150,
  fontSize: '.6em',
}

const NORMAL_SIZE = {
  width: 150,
  height: 225,
  fontSize: '1em',
}

const GINORMOUS_SIZE = {
  width: '80vw',
  height: '120vw',
  fontSize: '2em',
}

function Relic({
  slug,
  small,
  big,
  onClick,
  className,
  highlight,
}) {
  const stylesInit = small
      ? SMALL_SIZE
      : big
        ? GINORMOUS_SIZE
        : NORMAL_SIZE
  const background = sprite
  const classes = useStyles({ background, ...stylesInit })

  const textRenderer = useMemo(() => text => highlight
    ? <Highlighter
      searchWords={highlight}
      autoEscape={true}
      textToHighlight={text}
    />
    : text, [highlight])

  const { title, effect } = translations.relics[slug]

  return <div
    onClick={onClick}
    className={clsx(className, classes.root)}
  >
    <div className={clsx(classes.mask, classes.titleMask)}><p>{textRenderer(title)}</p></div>
    <div className={clsx(classes.mask, classes.effectMask)}><p>{textRenderer(effect)}</p></div>
  </div>
}

const useWithModalStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    }
  },
  clickable: {
    cursor: 'pointer',
  }
})

function RelicWithModal({
  small,
  ...other
}) {
  const classes = useWithModalStyles()
  const [bigOpen, setBigOpen] = useState(false)

  if (!small) {
    return <>
      <Relic
        small={small}
        {...other}
      />
    </>
  }

  return <>
    <Relic
      className={classes.clickable}
      small={small}
      onClick={() => setBigOpen(true)}
      {...other}
    />
    <Dialog
      className={classes.dialog}
      open={bigOpen}
      onClose={() => setBigOpen(false)}
    >
      <Relic
        big={true}
        {...other}
      />
    </Dialog>
  </>
}

export default RelicWithModal