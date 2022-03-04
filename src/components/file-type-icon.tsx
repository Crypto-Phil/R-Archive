import React, { ReactElement, SVGProps } from 'react'
import PDFIcon from 'assets/file-type-pdf.svg'
import CSVIcon from 'assets/file-type-csv.svg'
import TXTIcon from 'assets/file-type-txt.svg'
import DefaultIcon from 'assets/file-type-default.svg'
// import PictureIcon from 'assets/file-type-picture.svg'
// import VideoIcon from 'assets/file-type-video.svg'
import { FileTypeKeys } from 'types/file-type'

const IconsDictionary: {
  [key in FileTypeKeys]: (props: SVGProps<SVGElement>) => ReactElement
} = {
  'text/csv': CSVIcon,
  'application/pdf': PDFIcon,
  'text/plain': TXTIcon,
}

interface IconFileTypeProps extends SVGProps<SVGElement> {
  fileType: string
}

function fileTypeIsMatching(fileType: string): fileType is FileTypeKeys {
  return Object.keys(IconsDictionary).includes(fileType)
}

export const FileTypeIcon = ({ fileType, fill, height = 45, width = 45, className }: IconFileTypeProps) => {
  const icon = fileTypeIsMatching(fileType) ? IconsDictionary[fileType] : DefaultIcon
  const Component = icon

  return <Component height={height} width={width} fill={fill || undefined} className={className} />
}
